# coding: utf-8

from __future__ import absolute_import

import flask
from flask.ext import login
from flask.ext import wtf
import functools
import re
import unidecode
import wtforms

from google.appengine.ext import ndb

import cache
import config
from flask.ext.oauthlib import client as oauth
from main import app
import model
import task
import util
from auth import *



###############################################################################
# Sign in stuff
###############################################################################
class SignInForm(wtf.Form):
  email = wtforms.StringField(
      'Email',
      [wtforms.validators.required()],
      filters=[util.email_filter],
    )
  password = wtforms.StringField(
      'Password',
      [wtforms.validators.required()],
    )
  remember = wtforms.BooleanField(
      'Keep me signed in',
      [wtforms.validators.optional()],
    )
  recaptcha = wtf.RecaptchaField()
  next_url = wtforms.HiddenField()


@app.route('/signin/', methods=['GET', 'POST'])
def signin():
  next_url = util.get_next_url()
  form = None
  if config.CONFIG_DB.has_email_authentication:
    form = form_with_recaptcha(SignInForm())
    save_request_params()
    if form.validate_on_submit():
      result = get_user_db_from_email(form.email.data, form.password.data)
      if result:
        cache.reset_auth_attempt()
        return signin_user_db(result)
      if result is None:
        form.email.errors.append('Email or Password do not match')
      if result is False:
        return flask.redirect(flask.url_for('home'))
    if not form.errors:
      form.next_url.data = next_url

  if form and form.errors:
    cache.bump_auth_attempt()

  return flask.render_template(
      'share/auth/auth.html',
      title='Sign in',
      html_class='auth',
      next_url=next_url,
      form=form,
      form_type='signin' if config.CONFIG_DB.has_email_authentication else '',
      **urls_for_oauth(next_url)
    )


###############################################################################
# Sign up stuff
###############################################################################
class SignUpForm(wtf.Form):
  email = wtforms.StringField(
      'Email',
      [wtforms.validators.required(), wtforms.validators.email()],
      filters=[util.email_filter],
    )
  recaptcha = wtf.RecaptchaField()


@app.route('/signup/', methods=['GET', 'POST'])
def signup():
  # block signup based on configuration
  if not config.CONFIG_DB.signup_enabled:
      flask.flash("Signing up is disabled", category="info")
      return flask.redirect(flask.url_for('home'))
  next_url = util.get_next_url()
  form = None
  if config.CONFIG_DB.has_email_authentication:
    form = form_with_recaptcha(SignUpForm())
    save_request_params()
    if form.validate_on_submit():
      user_db = model.User.get_by('email', form.email.data)
      if user_db:
        form.email.errors.append('This email is already taken.')

      if not form.errors:
        user_db = create_user_db(
            None,
            util.create_name_from_email(form.email.data),
            form.email.data,
            form.email.data,
          )
        user_db.put()
        task.activate_user_notification(user_db)
        cache.bump_auth_attempt()
        return flask.redirect(flask.url_for('home'))

  if form and form.errors:
    cache.bump_auth_attempt()

  title = 'Sign up' if config.CONFIG_DB.has_email_authentication else 'Sign in'
  return flask.render_template(
      'share/auth/auth.html',
      title=title,
      html_class='auth',
      next_url=next_url,
      form=form,
      **urls_for_oauth(next_url)
    )


###############################################################################
# Sign out stuff
###############################################################################
@app.route('/signout/')
def signout():
  login.logout_user()
  return flask.redirect(util.param('next') or flask.url_for('home'))
