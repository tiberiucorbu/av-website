# coding: utf-8

from __future__ import absolute_import

from google.appengine.ext import ndb
import flask

from api import fields
import model
import util


class Resource(model.Base):
  user_key = ndb.KeyProperty(kind=model.User, required=True)
  blob_key = ndb.BlobKeyProperty(required=True)
  name = ndb.StringProperty(required=False)
  file_name = ndb.StringProperty(required=False)
  description = ndb.StringProperty(required=False)
  tags = ndb.StringProperty(repeated=True, indexed=True)
  bucket_name = ndb.StringProperty()
  image_url = ndb.StringProperty(default='')
  content_type = ndb.StringProperty(default='')
  size = ndb.IntegerProperty(default=0)
  image_thumb_data_url = ndb.TextProperty(required=False)
  image_average_color = ndb.StringProperty(required=False)
  image_size_w = ndb.FloatProperty(required=False)
  image_size_h = ndb.FloatProperty(required=False)

  @ndb.ComputedProperty
  def size_human(self):
    return util.size_human(self.size or 0)

  @property
  def download_url(self):
    if self.key:
      return flask.url_for(
          'resource_download', resource_id=self.key.id(), _external=True
        )
    return None

  @property
  def view_url(self):
    if self.key:
      return flask.url_for(
          'resource_view', resource_id=self.key.id(), _external=True,
        )
    return None

  @property
  def serve_url(self):
    return '%s/serve/%s' % (flask.request.url_root[:-1], self.blob_key)

  FIELDS = {
      'bucket_name': fields.String,
      'content_type': fields.String,
      'download_url': fields.String,
      'image_url': fields.String,
      'name': fields.String,
      'file_name': fields.String,
      'description': fields.String,
      'tags': fields.List(fields.String),
      'serve_url': fields.String,
      'size': fields.Integer,
      'size_human': fields.String,
      'view_url': fields.String,
      'image_thumb_data_url': fields.String,
      'image_average_color': fields.String,
      'image_size_w' : fields.Float,
      'image_size_h' : fields.Float
    }

  FIELDS.update(model.Base.FIELDS)
