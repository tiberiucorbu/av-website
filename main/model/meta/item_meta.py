# coding: utf-8

from __future__ import absolute_import

from google.appengine.ext import ndb

from api import fields
import config
import util


class ItemMeta(ndb.Model):
  # log_data
  alt_description = ndb.StringProperty()

  FIELDS = {
      'alt_description': fields.String
  }
