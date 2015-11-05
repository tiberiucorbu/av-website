# coding: utf-8

from __future__ import absolute_import

from flask.ext import wtf
import wtforms
import flask
from flask.ext import restful
from flask_restful import reqparse
import logging

from google.appengine.ext import blobstore
from google.appengine.ext import deferred
from google.appengine.ext import ndb

from api import helpers
import auth
from main import api_v1
import model
import util

@api_v1.resource('/generate/', endpoint='api.generate')
class GenerateAPI(restful.Resource):

  @auth.admin_required
  def get(self):
    token = util.param('token', str)
    response = {};
    if token == 'csrf':
        response['csrf_token'] = wtf.csrf.generate_csrf();
    return helpers.make_object_response(response)
