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

    tags = ndb.StringProperty(repeated=True, indexed=True)

    deprecated_category_id = ndb.IntegerProperty(required=False)
    deprecated_category_data = ndb.JsonProperty(required=False)
    story_items = ndb.KeyProperty(kind='StoryItem', repeated=True)
    story_item_count = ndb.ComputedProperty(lambda self: len(self.story_items))

    def url_safe_item_keys(self):
      result = []
      for key in self.story_items:
        result.append(key.urlsafe())
      return result

    story_items_keys =  ndb.ComputedProperty(url_safe_item_keys, repeated=True)

    child_stories = ndb.KeyProperty(kind='Story', repeated=True)
    child_stories_count = ndb.ComputedProperty(lambda self: len(self.child_stories))
    def url_safe_child_keys(self):
      result = []
      for key in self.child_stories:
        result.append(key.urlsafe())
      return result

    child_stories_keys =  ndb.ComputedProperty(url_safe_child_keys, repeated=True)

    def add_child_story(self, story_db):
      story_db.parent_story_key = self.key
      if story_db.key not in self.child_stories:
        self.child_stories.append(story_db.key)

    def remove_child_story(self, story_db):
      story_db.parent_story_key = None
      if story_db.key in self.child_stories:
        self.child_stories.remove(story_db.key)

    def add_story_item(self, story_item_db):
      story_item_db.story_key = self.key
      if story_item_db.key not in self.story_items:
        self.story_items.append(story_item_db.key)

    def remove_child_story(self, story_item_db):
      story_item_db.story_key = None
      if story_item_db.key in self.story_items:
        self.story_items.remove(story_item_db.key)



    # Exposed fields in the service api @see: api/v1/story.py
    # Must match the same name as the db table
    FIELDS = {
        'title': fields.String,
        'description': fields.String,
        'parent_story_key': fields.String,
        'is_root_story' : fields.Boolean,
        'deprecated_category_id': fields.Integer,
        'deprecated_category_data' : fields.String,
        'tags': fields.List(fields.String),
        'story_items_keys' : fields.List(fields.String),
        'story_item_count' : fields.Integer,
        'child_stories_keys' : fields.List(fields.String),
        'child_stories_count' : fields.Integer,
    }

    TAG_FIELD = {
      'tags': fields.List(fields.String)
    }

    FIELDS.update(model.Base.FIELDS)
    #FIELDS.update(model.VisibilityFlags.FIELDS)
    FIELDS.update(model.meta.PageMeta.FIELDS)
