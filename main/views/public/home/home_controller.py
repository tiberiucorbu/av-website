# coding: utf-8

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

from views.public.common import *

###############################################################################
# Welcome
###############################################################################


@app.route('/')
def home():
  resp_model = {}
  resp_model['html_class'] = 'hp'
  resp_model['canonical_path'] = flask.url_for(
      'home')
  decorate_page_response_model(resp_model)

  image_keys = util.get_from_dot_path(resp_model, 'page_data.image_keys')
  if len(image_keys) > 0:
    res_kes = [ndb.Key(urlsafe=k) for k in image_keys]
    resp_model['page_data'].update({'images': ndb.get_multi(res_kes)})
  return flask.render_template('public/home/home.html', model=resp_model)



@app.route('/blog', defaults={'path': ''})
@app.route('/blog/<path:path>')
def blog(path):
  # permanent redirection to the new story URL
  # find story by category id
  blog_url = 'http://anabellaveress.blogspot.de/'

  # add 301 for permanent redirection
  return flask.redirect(blog_url + path, 301)


@app.route('/category/<int:category_id>')
def category(category_id):
  # permanent redirection to the new story URL
  # find story by category id
  story = model.Story.get_by('deprecated_category_id', category_id)
  redirect_url = None
  if story:
    redirect_url = flask.url_for('story', story_key=util.story_key(story))
  else:
    flask.abort(418)
  return flask.redirect(redirect_url, 301)  # add 301 for permanent redirection


@app.route('/story/<story_key>')
def story(story_key):

  story_db = get_story_db(story_key)
  if story_db is None:
    flask.abort(404)
  resp_model = {}
  resp_model['html_class'] = 'story'
  resp_model['canonical_path'] = flask.url_for(
      'story', story_key=util.story_key(story_db))
  decorate_page_response_model(resp_model)
  decorate_story_page_model(resp_model, story_db)
  mode = util.param('m', str)
  templatePath = 'public/story/story.html'
  if 'gallery' == mode:
    templatePath = 'public/story/story_gallery.html'
  return flask.render_template(templatePath, model=resp_model)


@app.route('/stories')
def stories():
  cursor_str = util.param('cursor', str)
  cursor = None
  try:
    cursor = Cursor(urlsafe=cursor_str)
  except TypeError:
    key = None

  story_dbs, next_cursor, more = model.Story.query().filter(
      model.Story.story_item_count > 0).fetch_page(24, start_cursor=cursor)

  if len(story_dbs) == 0:
    flask.abort(404)
  params = {
      'next_cursor': next_cursor.urlsafe(),
      'current_cursor': cursor.urlsafe()
  }
  resp_model = {}
  resp_model['html_class'] = 'stories'
  resp_model['canonical_path'] = flask.url_for('stories')
  decorate_page_response_model(resp_model)
  decorate_stories_page_model(resp_model, story_dbs, params)
  return flask.render_template('public/story/story_list.html', model=resp_model)


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
    not_found = exceptions.NotFound()
    raise not_found
  params = {
      'next_cursor': next_cursor.urlsafe(),
      'tag': tag,
      'current_cursor': cursor.urlsafe()
  }
  resp_model = {}
  resp_model['html_class'] = 'tag'
  resp_model['canonical_path'] = flask.url_for('tag', tag=tag)
  decorate_page_response_model(resp_model)
  decorate_stories_page_model(resp_model, story_dbs, params)
  return flask.render_template('public/story/story_list.html', model=resp_model)


@app.route('/contact', methods=['GET', 'POST'])
def contact():
  resp_model = {}
  resp_model['html_class'] = 'contact'
  resp_model['canonical_path'] = flask.url_for('contact')
  decorate_page_response_model(resp_model)

  # Add feedbackform, present in the footer - needed for CXFR protection
  feedback_form = FeedbackForm(obj=auth.current_user_db())
  # Add layout switch param - this is the switcher for page render (full
  # (default), reduced)
  resp_model['feedback_form'] = feedback_form

  if 'feedback_form' in resp_model:
    feedback_form = resp_model['feedback_form']
    if not config.CONFIG_DB.has_anonymous_recaptcha or auth.is_logged_in():
      del feedback_form.recaptcha
    if feedback_form.validate_on_submit():
      if not config.CONFIG_DB.feedback_email:
        return flask.abort(418)
      body = '%s\n\n%s' % (feedback_form.message.data,
                           feedback_form.email.data)
      kwargs = {
          'reply_to': feedback_form.email.data} if feedback_form.email.data else {}
      task.send_mail_notification('%s...' % body[:48].strip(), body, **kwargs)
      flask.flash('Thank you for your feedback!', category='success')
      return flask.redirect(flask.url_for('home'))

  contact_page_db = model.ModuleConfig.get_by('module_id', 'contact-page')
  if contact_page_db is not None and contact_page_db.config is not None:
    contact_page_data = json.loads(contact_page_db.config)
    if 'page_data' in resp_model:
      resp_model['page_data'].update(contact_page_data)
    else:
      resp_model['page_data'] = contact_page_data
  if 'page_data' in resp_model and 'image_keys' in resp_model['page_data'] and len(resp_model['page_data']['image_keys']) > 0:
    res_kes = [ndb.Key(urlsafe=k)
               for k in resp_model['page_data']['image_keys']]
    resp_model['page_data']['images'] = ndb.get_multi(res_kes)

  return flask.render_template('public/contact/contact.html', model=resp_model)


@app.route('/about', methods=['GET', 'POST'])
def about():
  resp_model = {}
  resp_model['html_class'] = 'about'
  resp_model['canonical_path'] = flask.url_for('about')
  decorate_page_response_model(resp_model)

  about_page_db = model.ModuleConfig.get_by('module_id', 'about-page')
  if about_page_db is not None and about_page_db.config is not None:
    about_page_data = json.loads(about_page_db.config)
    if 'page_data' in resp_model:
      resp_model['page_data'].update(about_page_data)
    else:
      resp_model['page_data'] = about_page_data
  if 'page_data' in resp_model and 'image_keys' in resp_model['page_data'] and len(resp_model['page_data']['image_keys']) > 0:
    res_kes = [ndb.Key(urlsafe=k)
               for k in resp_model['page_data']['image_keys']]
    resp_model['page_data']['images'] = ndb.get_multi(res_kes)

  return flask.render_template('public/about/about.html', model=resp_model)


class FeedbackForm(wtf.Form):
  message = wtforms.TextAreaField(
      'Message',
      [wtforms.validators.required()], filters=[util.strip_filter],
  )
  name = wtforms.StringField(
      'Name',
      [wtforms.validators.optional()],
  )
  email = wtforms.StringField(
      'Email',
      [wtforms.validators.required(), wtforms.validators.email()],
      filters=[util.email_filter],
  )
  subject = wtforms.StringField(
      'Subject',
      [wtforms.validators.optional()]

  )
  recaptcha = wtf.RecaptchaField()


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