# coding: utf-8

from __future__ import absolute_import

from flask.ext import restful

from api import helpers
import auth
import config
from main import api_v1
import model


@api_v1.resource('/config/', endpoint='api.config')
class ConfigAPI(restful.Resource):
  @auth.admin_required
  def get(self):
    return helpers.make_response(config.CONFIG_DB, model.Config.FIELDS)
