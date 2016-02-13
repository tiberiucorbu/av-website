# coding: utf-8

from __future__ import absolute_import

import json

import auth
import model
import util
from api import helpers
from flask.ext import restful
from google.appengine.api import memcache
from google.appengine.ext import deferred
from google.appengine.ext import ndb

from main import api_v1

API_MODULE_CONFIG = 'api.moduleconfig'

MODULE_CONFIG = 'module_config'

META_DESCRIPTION = 'meta_description'

META_KEYWORDS = 'meta_keywords'

cache_mapping = {
    'main-navbar': 'main-navbar'
}


@api_v1.resource('/module-config/<string:module_id>/', endpoint=API_MODULE_CONFIG)
class ModuleConfigListAPI(restful.Resource):
    @auth.admin_required
    def get(self, module_id):
        module_config_db = find_by_module_id(module_id)
        return helpers.make_response(module_config_db, model.ModuleConfig.FIELDS)

    @auth.admin_required
    def post(self, module_id):
        module_config_obj = util.param(MODULE_CONFIG)

        if not module_config_obj:
            helpers.make_bad_request_exception(
                '`module_config` parameter is expected to be found in the request')
        meta = {
            META_KEYWORDS: util.param(META_KEYWORDS),
            META_DESCRIPTION: util.param(META_DESCRIPTION)
        }
        module_config_db = store_module_config(module_config_obj, meta, module_id)

        return helpers.make_response(module_config_db, model.ModuleConfig.FIELDS)

    @auth.admin_required
    def delete(self, module_id):
        module_config_keys = util.param('module_config_keys', list)
        if not module_config_keys:
            helpers.make_not_found_exception('Story(s) %s not found' % module_config_keys)
        module_config_db_keys = [ndb.Key(urlsafe=k) for k in module_config_keys]
        api_v1.set_obj_dbs_deleted(module_config_db_keys)
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


def fill_module_config(module_config_db, module_config_obj, module_id):
    module_config_db.user_key = auth.current_user_key()
    module_config_db.module_id = module_id
    module_config_db.config = json.dumps(module_config_obj, sort_keys=True)


@ndb.transactional(xg=True)
def save_to_db(module_config_db):
    module_config_db.put()


def find_by_module_id(module_id):
    module_config_db = model.ModuleConfig.get_by('module_id', module_id)
    return module_config_db


def fill_module_config_meta(module_config_db, meta):
    module_config_db.meta_keywords = meta[META_KEYWORDS]
    module_config_db.meta_description = meta[META_DESCRIPTION]


def store_module_config(config, meta, module_id):
    module_config_db = find_by_module_id(module_id)
    if not module_config_db:
        module_config_db = model.ModuleConfig(user_key=auth.current_user_key())

    fill_module_config(module_config_db, config, module_id)
    fill_module_config_meta(module_config_db, meta)
    save_to_db(module_config_db)
    if module_id in cache_mapping:
        memcache.delete(cache_mapping[module_id])
    return module_config_db
