# coding: utf-8

import flask

from main import app
import auth
import config
import model
import util
import control.public
import json
from google.appengine.ext import ndb
from google.appengine.datastore.datastore_query import Cursor
from werkzeug import exceptions

###############################################################################
# Welcome
###############################################################################


@app.route('/')
def home():
  resp_model = {}
  resp_model['html_class'] = 'hp'

  decorate_page_response_model(resp_model)

  if 'page_data' in resp_model and 'image_keys' in resp_model['page_data'] and len(resp_model['page_data']['image_keys']) > 0:
    res_kes = [ndb.Key(urlsafe=k) for k in resp_model['page_data']['image_keys']]
    resp_model['page_data']['images'] = ndb.get_multi(res_kes)

  return flask.render_template('public/home/home.html', model=resp_model)


@app.route('/category/<int:category_id>')
def category(category_id):
  # permanent redirection to the new story URL
  # find story by category id
  story = model.Story.get_by('deprecated_category_id', category_id)
  redirect_url = None
  if story:
    redirect_url = flask.url_for('story', story_key=story.title)
  else:
    not_found = exceptions.NotFound();
    raise not_found
  return flask.redirect(redirect_url)  # add 301 for permanent redirection


@app.route('/story/<story_key>')
def story(story_key):


  story_db = get_story_db(story_key)
  if story_db is None:
    not_found = exceptions.NotFound();
    raise not_found
  resp_model = {}
  resp_model['html_class'] = 'story'
  decorate_page_response_model(resp_model)
  decorate_story_page_model(resp_model, story_db)
  mode = util.param('m', str);
  templatePath = 'public/story/story.html';
  if 'gallery' == mode:
    templatePath = 'public/story/story_gallery.html';
  return flask.render_template(templatePath, model=resp_model)


@app.route('/tag/<tag>')
def tag(tag):
  cursor_str = util.param('cursor', str)
  cursor = None
  try:
    cursor = Cursor(urlsafe=cursor_str)
  except TypeError:
    key = None

  story_dbs, next_cursor, more = model.Story.query(
      model.Story.tags == tag).filter(model.Story.story_item_count > 0).fetch_page(24, start_cursor=cursor)

  if len(story_dbs) == 0:
    not_found = exceptions.NotFound();
    raise not_found
  params = {
      'next_cursor': next_cursor.urlsafe(),
      'tag': tag,
      'current_cursor': cursor.urlsafe()
  }
  resp_model = {}
  resp_model['html_class'] = 'tag'
  decorate_page_response_model(resp_model)
  decorate_stories_page_model(resp_model, story_dbs, params)
  return flask.render_template('public/story/story_list.html', model=resp_model)


@app.route('/about')
def about():
  resp_model = {}

  resp_model['html_class'] = 'about'
  decorate_page_response_model(resp_model)
  return flask.render_template('public/about/about.html', model=resp_model)

###############################################################################
# Sitemap stuff
###############################################################################


@app.route('/sitemap.xml')
def sitemap():
  response = flask.make_response(flask.render_template(
      'sitemap.xml',
      lastmod=config.CURRENT_VERSION_DATE.strftime('%Y-%m-%d'),
  ))
  response.headers['Content-Type'] = 'application/xml'
  return response


###############################################################################
# Warmup request
###############################################################################
@app.route('/_ah/warmup')
def warmup():
  return 'success'


def get_story_db(key):
  story_db = model.Story.query(model.Story.canonical_path == key).get()
  if story_db is None and key.isdigit():
    story_db = ndb.Key('Story', long(key)).get()
  if story_db is None:
    key = None
    try:
      key = ndb.Key(urlsafe=key)
    except TypeError:
      key = None
    if key is not None:
      story_db = key.get()
  return story_db


def decorate_story_page_model(resp_model, story_db):
  resp_model['story'] = story_db


def decorate_stories_page_model(resp_model, story_dbs, params):
  resp_model['stories'] = story_dbs
  resp_model['params'] = params


def decorate_page_response_model(resp_model):
  # home page data present in every page
  home_page_db = model.ModuleConfig.get_by('module_id', 'home-page')
  if home_page_db is not None and home_page_db.config is not None:
    home_page_data = json.loads(home_page_db.config)
    resp_model['page_data'] = home_page_data

    # Add navbar data
  main_navbar_db = model.ModuleConfig.get_by('module_id', 'main-navbar')
  if main_navbar_db is not None and main_navbar_db.config is not None:
    main_navbar_data = json.loads(main_navbar_db.config)
    resp_model['navbar'] = main_navbar_data

  # Add feedbackform, present in the footer - needed for CXFR protection
  feedback_form = control.public.FeedbackForm(obj=auth.current_user_db())
  # Add layout switch param - this is the switcher for page render (full
  # (default), reduced)
  resp_model['feedback_form'] = feedback_form
  view = util.param('v', str)

  resp_model['view_reduced'] = False
  if view == 'r':
    resp_model['view_reduced'] = True
