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
import json


@api_v1.resource('/module-config/<string:module_id>/', endpoint='api.moduleconfig')
class ModuleConfigListAPI(restful.Resource):
  @auth.admin_required
  def get(self, module_id):
    module_config_db = find_by_module_id(module_id)
    return helpers.make_response(module_config_db, model.ModuleConfig.FIELDS)

  @auth.admin_required
  def post(self, module_id):
    module_config_obj = util.param('module_config')

    if not module_config_obj:
      helpers.make_bad_request_exception('`module_config` parameter is expected to be found in the request')
    meta = {
      'meta_keywords' : util.param('meta_keywords'),
      'meta_description' : util.param('meta_description')
    }
    module_config_db = store_module_config(module_config_obj, meta, module_id)

    return helpers.make_response(module_config_db, model.ModuleConfig.FIELDS)

  @auth.admin_required
  def delete(self, module_id):
    module_config_keys = util.param('module_config_keys', list)
    if not module_config_keys:
      helpers.make_not_found_exception('Story(s) %s not found' % module_config_keys)
    module_config_db_keys = [ndb.Key(urlsafe=k) for k in module_config_keys]
    delete_story_dbs(module_config_db_keys)
    return flask.jsonify({
        'result': module_config_keys,
        'status': 'success',
      })



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


def fill_module_config(module_config_db, module_config_obj, module_id) :
    module_config_db.user_key=auth.current_user_key()
    module_config_db.module_id = module_id
    module_config_db.config = json.dumps(module_config_obj, sort_keys=True)

@ndb.transactional(xg=True)
def save_to_db(module_config_db):
    module_config_db.put()

def find_by_module_id(module_id):
    module_config_db = model.ModuleConfig.get_by('module_id', module_id)
    return module_config_db

def fill_module_config_meta(module_config_db, meta):
  module_config_db.meta_keywords = meta['meta_keywords']
  module_config_db.meta_description = meta['meta_description']

def store_module_config(config, meta, module_id):
    module_config_db = find_by_module_id(module_id)
    if not module_config_db:
        module_config_db = model.ModuleConfig(user_key=auth.current_user_key())

    fill_module_config(module_config_db, config, module_id)
    fill_module_config_meta(module_config_db, meta)
    save_to_db(module_config_db)
    return module_config_db
