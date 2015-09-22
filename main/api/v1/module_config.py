# coding: utf-8

from __future__ import absolute_import

import logging

from flask.ext import restful
from google.appengine.ext import blobstore
from google.appengine.ext import deferred
from google.appengine.ext import ndb
import flask
from flask_restful import reqparse

from api import helpers
import auth
import model
import util

from main import api_v1

@api_v1.resource('/module-config/', endpoint='api.moduleconfig.list')
class ModuleConfigAPI(restful.Resource):
  @auth.admin_required
  def get(self):
    module_config_keys = util.param('module_config_keys', list)

    if module_config_keys:
      module_config_db_keys = [ndb.Key(urlsafe=k) for k in module_config_keys]
      module_config_dbs = ndb.get_multi(module_config_db_keys)
      return helpers.make_response(module_config_dbs, model.ModuleConfig.FIELDS)

    module_config_dbs, cursor = model.ModuleConfig.get_dbs()
    return helpers.make_response(module_config_dbs, model.ModuleConfig.FIELDS, cursor)

  @auth.admin_required
  def delete(self):
    story_keys = util.param('story_keys', list)
    if not story_keys:
      helpers.make_not_found_exception('Story(s) %s not found' % story_keys)
    stoty_db_keys = [ndb.Key(urlsafe=k) for k in story_keys]
    delete_story_dbs(story_db_keys)
    return flask.jsonify({
        'result': story_keys,
        'status': 'success',
      })


@api_v1.resource('/story/<string:story_key>/', endpoint='api.storyitem')
class StoryAPI(restful.Resource):
  @auth.admin_required
  def get(self, user_key):
    user_db = ndb.Key(urlsafe=story_key).get()
    if not user_db:
      helpers.make_not_found_exception('Story %s not found' % user_key)
    return helpers.make_response(user_db, model.Story.FIELDS)

  @auth.admin_required
  def delete(self, story_key):
    story_db = ndb.Key(urlsafe=story_key).get()
    if not story_db:
      helpers.make_not_found_exception('Story %s not found' % story_key)
    delete_story_task(story_db.key)
    return helpers.make_response(user_db, model.Story.FIELDS)


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
