# coding: utf-8

from __future__ import absolute_import

from flask.ext import wtf
import wtforms
import flask
from flask.ext import restful
from flask_restful import reqparse
import logging

from google.appengine.ext import blobstore
from google.appengine.ext import deferred
from google.appengine.ext import ndb

from api import helpers
import auth
from main import api_v1
import model
import util


@api_v1.resource('/story/', endpoint='api.story.list')
class StoryListAPI(restful.Resource):

  @auth.admin_required
  def get(self):

    query = model.Story.query() # Retrieve all Story entitites

    root_story_only = util.param('root-stories', bool)

    if root_story_only :
      query = query.filter(model.Story.parent_story_key == None);

    stories_with_items = util.param('stories-with-items', bool)
    if stories_with_items :
      query = query.filter(model.Story.story_item_count > 0);

    story_keys = util.param('story-keys', list)
    if story_keys:
      story_db_keys = [ndb.Key(urlsafe=k) for k in story_keys]
      story_dbs = ndb.get_multi(story_db_keys)
      return helpers.make_response(story_dbs, model.Story.FIELDS)

    story_dbs, story_cursor = model.Story.get_dbs(query)
    return helpers.make_response(story_dbs, model.Story.FIELDS, story_cursor)

  def post(self):

    id = util.param('id', long)
    key = util.param('key', str)

    form = StoryUpdateForm()
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
    if not story_keys:
      helpers.make_not_found_exception('Story(s) %s not found' % story_keys)
    stoty_db_keys = [ndb.Key(urlsafe=k) for k in story_keys]
    delete_story_dbs(stoty_db_keys)
    return flask.jsonify({
        'result': story_keys,
        'status': 'success',
    })


@api_v1.resource('/story/props/', endpoint='api.story.props')
class StoryAPI(restful.Resource):

  @auth.admin_required
  def get(self):
    query = model.Story.query(projection=["tags"], distinct=True)
    story_db = query.fetch()
    #if not story_db.tags:
    #  helpers.make_not_found_exception('No tags defined')
    return helpers.make_response(story_db, model.Story.TAG_FIELD)



###############################################################################
# Helpers
###############################################################################
@ndb.transactional(xg=True)
def delete_story_dbs(story_db_keys):
  for story_key in story_db_keys:
    delete_story_task(story_key)


def populate_story_db(story_db, form):
  story_db.user_key=auth.current_user_key()
  story_db.title=form.title.data
  story_db.description=form.description.data
  story_db.tags=form.tags.data
  story_db.meta_keywords=form.meta_keywords.data
  story_db.meta_description=form.meta_keywords.data
  story_db.tags=form.tags.data
  story_db.canonical_path=form.canonical_path.data
  story_db.deprecated_category_id=form.deprecated_category_id.data
  story_db.deprecated_category_data=form.deprecated_category_data.data

  resource_db_keys = [ndb.Key(urlsafe=k) for k in form.story_items.data]
  story_db.story_items = resource_db_keys

def delete_story_task(story_key, next_cursor=None):
  if next_cursor:
    deferred.defer(delete_story_task, story_key, next_cursor)
  else:
    story_key.delete()


class ListField(wtforms.Field):
  widget = wtforms.widgets.TextInput()

  def _value(self):
    if self.data:
      return u', '.join(self.data)
    else:
      return u''

  def process_formdata(self, valuelist):
    if valuelist:
      self.data = [x.strip() for x in valuelist[0].split(',')]
    else:
      self.data = []

class StoryUpdateForm(wtf.Form):
  title = wtforms.StringField('Title', [wtforms.validators.required()])
  description = wtforms.StringField(
      'Description', [wtforms.validators.optional()])
  tags = ListField('Tags', [wtforms.validators.optional()])
  story_items = ListField('Items Keys', [wtforms.validators.optional()])
  canonical_path = wtforms.StringField(
      'Canonical Path', [wtforms.validators.optional()])
  meta_keywords = wtforms.StringField(
      'Meta Kewords', [wtforms.validators.optional()])
  meta_description = wtforms.StringField(
      'Meta Description', [wtforms.validators.optional()])
  deprecated_category_id = wtforms.IntegerField(
      'Old Category Id', [wtforms.validators.optional()])
  deprecated_category_data = wtforms.StringField(
      'Old Category Data', [wtforms.validators.optional()])
