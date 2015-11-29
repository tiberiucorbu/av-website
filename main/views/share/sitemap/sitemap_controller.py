
import flask
import wtforms
from flask.ext import wtf

from main import app
import auth
import config
import model
import util
import task
import views.public
import json
from google.appengine.ext import ndb
from google.appengine.datastore.datastore_query import Cursor
from werkzeug import exceptions, routing


###############################################################################
# Sitemap stuff
###############################################################################


@app.route('/sitemap.xml')
def sitemap():
  response = flask.make_response(flask.render_template(
      'share/sitemap/sitemap.xml',
      lastmod=config.CURRENT_VERSION_DATE.strftime('%Y-%m-%d'),
  ))
  response.headers['Content-Type'] = 'application/xml'
  return response
