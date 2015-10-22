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


@ndb.transactional(xg=True)
def delete_dbs(db_keys):
  for key in db_keys:
    delete_task(key)


def delete_task(key, next_cursor=None):
  if next_cursor:
    deferred.defer(delete_task, key, next_cursor)
  else:
    key.delete()
