# coding: utf-8

from __future__ import absolute_import

from google.appengine.ext import ndb

from api import fields
import config
import util


class VisibilityFlags(ndb.Model):
  # log_data
  deleted = ndb.DateTimeProperty()
  disabled = ndb.DateTimeProperty()

  FIELDS = {
      'deleted': fields.DateTime,
      'disabled': fields.DateTime
  }
