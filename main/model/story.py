# coding: utf-8

from __future__ import absolute_import

from google.appengine.ext import ndb
import flask

from api import fields
import model

import util

class Story(model.Base, model.VisibilityFlags, model.PageMeta):

    # database fields
    user_key = ndb.KeyProperty(kind=model.User, required=True)
    parent_story_key = ndb.KeyProperty()
    title = ndb.StringProperty(required=True)
    description = ndb.StringProperty(default='')
    tags = ndb.StringProperty(repeated=True)


    # Exposed fields in the service api @see: api/v1/story.py
    # Must match the same name as the db table
    FIELDS = {
        'title': fields.String,
        'description': fields.String,
        'parent_story_key': fields.Integer,
        'tags': fields.String
    }

    FIELDS.update(model.Base.FIELDS)
    FIELDS.update(model.VisibilityFlags.FIELDS)
    FIELDS.update(model.meta.PageMeta.FIELDS)
