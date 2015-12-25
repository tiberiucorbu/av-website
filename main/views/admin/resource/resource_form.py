import urllib

from flask.ext import wtf
from google.appengine.ext import blobstore
import flask
import wtforms

import auth
import config
import model
import util

from main import app

from views import  ListField

class ResourceForm(wtf.Form):
  name = wtforms.TextField('Name', [wtforms.validators.required()])
  description = wtforms.StringField(
      'Description', [wtforms.validators.optional()])
  tags = ListField('Tags', [wtforms.validators.optional()])
  image_average_color = wtforms.StringField(
      'Average Color', [wtforms.validators.optional()])
