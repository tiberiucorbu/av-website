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
  available = ndb.DateTimeProperty()

  FIELDS = {
      'deleted': fields.DateTime,
      'disabled': fields.DateTime,
      'available': fields.DateTime
  }

  @property
  def is_public(self):
    """
    checks if the item is visible or not to the public
    """

    return bool(self.anonymous_recaptcha and self.has_recaptcha)
