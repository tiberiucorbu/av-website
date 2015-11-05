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
    # parser = reqparse.RequestParser()
    # parser.add_argument('order', type=str, help='Rate cannot be converted')
    # parser.add_argument('limit', type=int)
    # args = parser.parse_args()
    story_keys = util.param('story_keys', list)

    if story_keys:
      story_db_keys = [ndb.Key(urlsafe=k) for k in story_keys]
      story_dbs = ndb.get_multi(story_db_keys)
      return helpers.make_response(story_dbs, model.Story.FIELDS)

    story_dbs, story_cursor = model.Story.get_dbs()
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

      story_db.user_key=auth.current_user_key()
      story_db.title=form.title.data
      story_db.description=form.description.data
      story_db.meta_keywords=form.meta_keywords.data
      story_db.meta_description=form.meta_keywords.data

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


@api_v1.resource('/story/<string:story_key>/', endpoint='api.story')
class StoryAPI(restful.Resource):

  @auth.admin_required
  def get(self, story_key):
    story_db = ndb.Key(urlsafe=story_key).get()
    if not story_db:
      helpers.make_not_found_exception('Story %s not found' % story_key)
    return helpers.make_response(story_db, model.Story.FIELDS)

  @auth.admin_required
  def delete(self, story_key):
    story_db = ndb.Key(urlsafe=story_key).get()
    if not story_db:
      helpers.make_not_found_exception('Story %s not found' % story_key)
    delete_story_task(story_db.key)
    return helpers.make_response(story_db, model.Story.FIELDS)


###############################################################################
# Helpers
###############################################################################
@ndb.transactional(xg=True)
def delete_story_dbs(story_db_keys):
  for story_key in story_db_keys:
    delete_story_task(story_key)


def delete_story_task(story_key, next_cursor=None):
  if next_cursor:
    deferred.defer(delete_story_task, story_key, next_cursor)
  else:
    story_key.delete()


class TagListField(wtforms.Field):
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
  disabled = wtforms.DateField(
      'Disabled On', [wtforms.validators.optional()])
  deleted = wtforms.DateTimeField(
      'Delete On', [wtforms.validators.optional()], format='%Y/%m/%d %H:%M')
  available = wtforms.DateField(
      'Available On', [wtforms.validators.optional()])
  tags = TagListField('Tags', [wtforms.validators.optional()])
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
