# coding: utf-8

from __future__ import absolute_import

import auth
import model
import util
import flask
from api import helpers
from flask.ext import restful
from google.appengine.ext import ndb
from views.admin.story import StoryForm
from api.v1 import api_resource_base

from main import api_v1
from datetime import datetime


@api_v1.resource('/story/', endpoint='api.story.list')
class StoryListAPI(restful.Resource):
    @auth.admin_required
    def get(self):

        query = model.Story.query()  # Retrieve all Story entities

        root_story_only = util.param('root-stories', bool)

        if root_story_only:
            query = query.filter(model.Story.parent_story_key is None);

        stories_with_items = util.param('stories-with-items', bool)
        if stories_with_items:
            query = query.filter(model.Story.story_item_count > 0);

        story_keys = util.param('story-keys', list)
        if story_keys:
            story_db_keys = [ndb.Key(urlsafe=k) for k in story_keys]
            story_dbs = ndb.get_multi(story_db_keys)
            return helpers.make_response(story_dbs, model.Story.FIELDS)

        story_dbs, story_cursor = model.Story.get_dbs(query)

        fields = {};
        fields.update(model.Story.FIELDS);

        load_items = util.param('load-items', bool);
        if load_items:
            fields.update(model.Story.FIELD_STORY_ITEMS);

        load_childs = util.param('load-childs', bool);
        if load_childs:
            fields.update(model.Story.FIELD_CHILD_STORIES);

        load_parent = util.param('load-parent', bool);
        if load_parent:
            fields.update(model.Story.FIELD_PARENT_STORY);

        return helpers.make_response(story_dbs, fields, story_cursor)

    @auth.admin_required
    def post(self):

        id = util.param('id', long)
        key = util.param('key', str)

        form = StoryForm()
        if form.validate():
            story_db = None
            if key is not None:
                story_db = ndb.Key(urlsafe=key).get();
            elif id is not None:
                story_db = model.Story().get_by('id', id);
            else:
                story_db = model.Story();

            populate_story_db(story_db, form)

            story_db.put()

            return helpers.make_response(story_db, model.Story.FIELDS)

        return helpers.make_invalid_form_response(form.data, form.errors)

    @auth.admin_required
    def delete(self):
        story_keys = util.param('story_keys', list)
        restore = util.param('restore', bool)
        if not story_keys:
            helpers.make_not_found_exception('Story(s) %s assigned in the parameter [story_keys]'
                                             ' not found' % story_keys)
        story_db_keys = [ndb.Key(urlsafe=k) for k in story_keys]
        api_resource_base.set_obj_dbs_deleted(story_db_keys, restore)
        return flask.jsonify({
            'result': story_keys,
            'status': 'success',
            'now': datetime.utcnow().isoformat()
        })


@api_v1.resource('/story/props/', endpoint='api.story.props')
class StoryAPI(restful.Resource):
    @auth.admin_required
    def get(self):
        query = model.Story.query(projection=["tags"], distinct=True)
        story_db = query.fetch()
        # if not story_db.tags:
        #  helpers.make_not_found_exception('No tags defined')
        return helpers.make_response(story_db, model.Story.TAG_FIELD)


###############################################################################
# Helpers
###############################################################################

def populate_story_db(story_db, form):
    story_db.user_key = auth.current_user_key()
    story_db.title = form.title.data
    story_db.description = form.description.data
    story_db.tags = form.tags.data
    story_db.meta_keywords = form.meta_keywords.data
    story_db.meta_description = form.meta_description.data
    story_db.tags = form.tags.data
    story_db.canonical_path = form.canonical_path.data
    story_db.deprecated_category_id = form.deprecated_category_id.data
    story_db.deprecated_category_data = form.deprecated_category_data.data

    story_items = util.param('story_items', list)
    if story_items:
        resource_db_keys = [ndb.Key(urlsafe=k) for k in story_items]
        story_db.story_items = resource_db_keys
