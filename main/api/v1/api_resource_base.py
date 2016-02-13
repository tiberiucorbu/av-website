# coding: utf-8

from __future__ import absolute_import

from datetime import datetime

import model
from google.appengine.ext import deferred
from google.appengine.ext import ndb


def set_obj_dbs_deleted(keys, restore=False):
    for key in keys:
        set_obj_db_deleted(key, restore)


@ndb.transactional(xg=True)
def set_obj_db_deleted(key, restore=False):
    obj_db = key.get()
    if isinstance(obj_db, model.common.visibility_flags.VisibilityFlags):
        if restore:
            obj_db.deleted_date = None
        else:
            obj_db.deleted_date = datetime.now()
        obj_db.put()


@ndb.transactional(xg=True)
def delete_dbs(db_keys):
    for key in db_keys:
        delete_task(key)


def delete_task(key, next_cursor=None):
    if next_cursor:
        deferred.defer(delete_task, key, next_cursor)
    else:
        key.delete()
