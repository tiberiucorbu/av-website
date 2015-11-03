# coding: utf-8

import flask

from main import app
import auth
import config
import model
import util
import control.public
import json

###############################################################################
# Welcome
###############################################################################
@app.route('/')
def home():
  resp_model = {};

  resp_model['html_class'] = 'home'

  decorate_page_response_model(resp_model)

  featured_stories = model.Story.query(model.Story.tags == "featured");
  resp_model['featured_stories'] = featured_stories
  return flask.render_template('public/home/home.html', model=resp_model)


@app.route('/category/<int:category_id>')
def category(category_id):
  # permanent redirection to the new story URL
  #find story by category id
  story = model.Story.get_by('deprecated_category_id', category_id);
  redirect_url = None
  if story :
      redirect_url =flask.url_for('story', story_key=story.title)
  else :
      # TODO: flash a message here

      redirect_url =flask.url_for('home')
  return flask.redirect(redirect_url) # add 301 for permanent redirection


@app.route('/story/<story_key>')
def story(story_key):
  # if key_is_id(story_key):
  #     redirect_to_seo
  #
  # key_is_seo_token(story_key);
  resp_model = {};
  resp_model['html_class'] = 'about'
  decorate_page_response_model(resp_model)
  return flask.render_template('public/about/about.html', model=resp_model)

@app.route('/about')
def about():
  resp_model = {};

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
  # TODO: put your warmup code here
  return 'success'


def decorate_page_response_model(resp_model) :
    # Add navbar data
    main_navbar_db = model.ModuleConfig.get_by('module_id', 'main-navbar')
    if main_navbar_db is not None and main_navbar_db.config is not None:
      main_navbar_data = json.loads(main_navbar_db.config)
      resp_model['navbar'] = main_navbar_data

    # Add feedbackform, present in the footer - needed for CXFR protection
    feedback_form = control.public.FeedbackForm(obj=auth.current_user_db())
    # Add layout switch param - this is the switcher for page render (full (default), reduced)
    resp_model['feedback_form'] = feedback_form
    view = util.param('v', str)

    resp_model['view_reduced'] = False
    if view == 'r':
        resp_model['view_reduced'] = True
