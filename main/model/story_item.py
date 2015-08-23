# coding: utf-8

from __future__ import absolute_import

from google.appengine.ext import ndb
import flask

from api import fields
import model
import util


class StoryItem(model.Base, model.VisibilityFlags):
  """
    SoryItem

    Refers to an item within a story that can hold a text, or a reference
    to a resource.
  """
  user_key = ndb.KeyProperty(kind=model.User, required=True)
  story_key = ndb.KeyProperty(kind=model.Story)
  ref_url = ndb.StringProperty()
  raw_data = ndb.StringProperty()
  formated_data = ndb.StringProperty()
  mime_type = ndb.StringProperty(required=True)
  tags = ndb.StringProperty(repeated=True)

  # Exposed fields in the service api @see: api/v1/media.py
  # Must match the same name as the db table
  FIELDS = {
      'user_key': fields.String,
      'story_key': fields.String,
      'ref_url': fields.String,
      'raw_data': fields.Blob,
      'mime_type': fields.String,
      'tags' : fields.String
    }

  FIELDS.update(model.Base.FIELDS)
  FIELDS.update(model.VisibilityFlags.FIELDS)