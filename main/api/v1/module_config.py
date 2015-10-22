# coding: utf-8

from __future__ import absolute_import

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


@api_v1.resource('/module-config/', endpoint='api.moduleconfig.list')
class ModuleConfigListAPI(restful.Resource):
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
  def post(self, module_config_key):
    module_config_obj = util.param('module_config')
    if not module_config_obj:
      helpers.make_bad_request_exception(' `module_config` json parameter is expected to be found in request but was not found ')
    module_config_db.
    return helpers.make_response(module_config_db, model.ModuleConfiguration.FIELDS)
  @auth.admin_required
  def delete(self):
    module_config_keys = util.param('module_config_keys', list)
    if not module_config_keys:
      helpers.make_not_found_exception('Story(s) %s not found' % module_config_keys)
    module_config_db_keys = [ndb.Key(urlsafe=k) for k in module_config_keys]
    delete_story_dbs(module_config_db_keys)
    return flask.jsonify({
        'result': module_config_keys,
        'status': 'success',
      })


@api_v1.resource('/module-config/<string:module_config_key>/', endpoint='api.moduleconfig')
class ModuleConfigAPI(restful.Resource):
  @auth.admin_required
  def get(self, module_config_key):
    module_config_db = ndb.Key(urlsafe=module_config_key).get()
    if not module_config_db:
      helpers.make_not_found_exception(' configuration  for Module with the key %s was not found' % module_config_key)
    return helpers.make_response(module_config_db, model.ModuleConfiguration.FIELDS)

  @auth.admin_required
  def delete(self, module_config_key):
    module_config_db = ndb.Key(urlsafe=module_config_key).get()
    if not module_config_db:
      helpers.make_not_found_exception(' configuration  for Module with the key %s was not found' % module_config_key)
    delete_module_config_task(story_db.key)
    return helpers.make_response(user_db, model.Story.FIELDS)


###############################################################################
# Helpers
###############################################################################
@ndb.transactional(xg=True)
def delete_module_config_dbs(db_keys):
  for story_key in db_keys:
    delete_module_config_task(story_key)


def delete_module_config_task(key, next_cursor=None):
  if next_cursor:
    deferred.defer(delete_module_config_task, key, next_cursor)
  else:
    key.delete()
