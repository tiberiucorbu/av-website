
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
# Sitemap
###############################################################################


@app.route('/sitemap.xml')
def sitemap():
  resp_model = {}
  resp_model['pages'] = []
  fetch_home(resp_model)
  fetch_stories(resp_model)
  fetch_about(resp_model)
  fetch_contact(resp_model)
  response = flask.make_response(flask.render_template(
      'share/sitemap/sitemap.xml',
      model = resp_model,
      lastmod=config.CURRENT_VERSION_DATE.strftime('%Y-%m-%d'),
  ))
  response.headers['Content-Type'] = 'application/xml'
  return response

def fetch_about(resp_model):
  about = model.ModuleConfig.get_by('module_id', 'about-page')
  sitemap_item = module_to_sitemap_item(about, 'about')
  sitemap_item['priority'] = '0.2'
  resp_model['pages'].append(sitemap_item)

def fetch_contact(resp_model):
  about = model.ModuleConfig.get_by('module_id', 'contact-page')
  sitemap_item = module_to_sitemap_item(about, 'contact')
  sitemap_item['priority'] = '0.2'
  resp_model['pages'].append(sitemap_item)

def fetch_home(resp_model):
  about = model.ModuleConfig.get_by('module_id', 'home-page')
  sitemap_item = module_to_sitemap_item(about, 'home')
  sitemap_item['priority'] = '1'
  resp_model['pages'].append(sitemap_item)

def fetch_stories(resp_model):
  story_dbs = model.Story.query().filter(
      model.Story.story_item_count > 0).fetch()
  for story_db in story_dbs :
    story = story_to_sitemap(story_db)
    resp_model['pages'].append(story)

def story_to_sitemap(story):
  sitemap = {}
  sitemap['url'] = flask.url_for('story', story_key=util.story_key(story), _external=True)
  sitemap['lastmod'] = story.modified.strftime('%Y-%m-%d')
  sitemap['priority'] = '0.7'
  return sitemap

def module_to_sitemap_item(module, route_name):
  sitemap = {}
  sitemap['url'] = flask.url_for(route_name, _external=True)
  sitemap['lastmod'] = module.modified.strftime('%Y-%m-%d')
  sitemap['priority'] = '0.5'
  return sitemap
