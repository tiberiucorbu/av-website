# coding: utf-8

import flask

from main import app
import auth
import config
import model
import util
import control.public

###############################################################################
# Welcome
###############################################################################
@app.route('/')
def home():
  featured_stories = model.Story.query(model.Story.tags == "featured");
  feedback_form = control.public.FeedbackForm(obj=auth.current_user_db())
  return flask.render_template('public/home/home.html', html_class='home', feedback_form=feedback_form, featured_stories=featured_stories)


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
