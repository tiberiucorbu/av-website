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
# Warmup request
###############################################################################
@app.route('/_ah/warmup')
def warmup():
  return 'success'
