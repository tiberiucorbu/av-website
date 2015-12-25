# coding: utf-8

from __future__ import absolute_import

from google.appengine.ext import ndb
import flask

from api import fields
import model

import util

class ModuleConfig(model.Base, model.PageMeta):

    #     database fields
    user_key = ndb.KeyProperty(kind=model.User, required=True)
    module_id = ndb.StringProperty(required=True)
    config = ndb.JsonProperty(required=True)

    # Exposed fields in the service api @see: api/v1/module_config.py
    # Must match the same name as the db table
    FIELDS = {
        'module_id': fields.String,
        'config': fields.String
    }

    FIELDS.update(model.Base.FIELDS)
    FIELDS.update(model.meta.PageMeta.FIELDS)
