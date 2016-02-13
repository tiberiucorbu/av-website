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

from views.public.contact import ContactForm

@app.route('/contact', methods=['GET', 'POST'])
def contact():
  resp_model = {}
  resp_model['html_class'] = 'contact'
  resp_model['canonical_path'] = flask.url_for('contact')
  decorate_page_response_model(resp_model)

  # Add feedbackform, present in the footer - needed for CXFR protection
  contact_form = ContactForm(obj=auth.current_user_db())
  # Add layout switch param - this is the switcher for page render (full
  # (default), reduced)
  resp_model['contact_form'] = contact_form

  if 'contact_form' in resp_model:
    contact_form = resp_model['contact_form']
    if not config.CONFIG_DB.has_anonymous_recaptcha or auth.is_logged_in():
      del contact_form.recaptcha
    if contact_form.validate_on_submit():
      if not config.CONFIG_DB.feedback_email:
        return flask.abort(418)
      body = '%s\n\n%s' % (contact_form.message.data,
                           contact_form.email.data)
      kwargs = {
          'reply_to': contact_form.email.data} if contact_form.email.data else {}
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
