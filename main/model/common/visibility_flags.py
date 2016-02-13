# coding: utf-8

from __future__ import absolute_import

from google.appengine.ext import ndb

from api import fields
import config
import util
from datetime import datetime
from datetime import timedelta


class VisibilityFlags(ndb.Model):
    def is_deleted(self):
        if self.deleted_date:
            return datetime.now() > self.deleted_date
        else:
            return False

            #    @classmethod

    def is_trash(self):
        if self.deleted_date:
            return self.deleted_date < datetime.now() - timedelta(days=7)
        else:
            return False

    # log_data
    deleted_date = ndb.DateTimeProperty()
    deleted = ndb.ComputedProperty(is_deleted)

    @classmethod
    def get_trashed(cls):
        return cls.query(cls.deleted == True)

    FIELDS = {
        'deleted': fields.Boolean,
        'deleted_date': fields.DateTime,
        'trash': fields.Boolean
    }
