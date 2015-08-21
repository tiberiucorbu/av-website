# coding: utf-8

from __future__ import absolute_import

from google.appengine.ext import ndb

from api import fields
import config
import util


class PageMeta(ndb.Model):
  # log_data
  meta_keywords = ndb.StringProperty()
  meta_description = ndb.StringProperty()
  canonical_path = ndb.StringProperty()

  FIELDS = {
      'meta_keywords': fields.String,
      'meta_description': fields.String,
      'canonical_path': fields.String
  }
