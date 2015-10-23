# coding: utf-8

from __future__ import absolute_import

from google.appengine.ext import ndb
import flask

from api import fields
import model

import util

class Story(model.Base, model.VisibilityFlags, model.PageMeta):

    #     database fields
    user_key = ndb.KeyProperty(kind=model.User, required=True)
    parent_story_key = ndb.KeyProperty(kind='Story')
    title = ndb.StringProperty(required=True)
    description = ndb.TextProperty(default='')
    tags = ndb.StringProperty(repeated=True)
    deprecated_category_id = ndb.IntegerProperty(required=False)
    deprecated_category_data = ndb.JsonProperty(required=False)

    """
        Circular reference here A story is a parent of a story item.
    """
    story_items = ndb.KeyProperty(kind='StoryItem', repeated=True)
    """
        Recursive reference, A story can be is a parent of another story.
    """
    child_stories = ndb.KeyProperty(kind='Story', repeated=True)


    # Exposed fields in the service api @see: api/v1/story.py
    # Must match the same name as the db table
    FIELDS = {
        'title': fields.String,
        'description': fields.String,
        'parent_story_key': fields.Integer,
        'deprecated_category_id': fields.Integer,
        'deprecated_category_data' : fields.String,
        'tags': fields.List(fields.String)
    }

    FIELDS.update(model.Base.FIELDS)
    FIELDS.update(model.VisibilityFlags.FIELDS)
    FIELDS.update(model.meta.PageMeta.FIELDS)
