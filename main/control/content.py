# coding: utf-8

from flask.ext import wtf
import flask
import wtforms

import auth
import config
import model
import util

from main import app


###############################################################################
# Admin Stuff
###############################################################################
@app.route('/admin/content/navbar')
@auth.admin_required
def admin_content_navbar():
  return flask.render_template(
      'content/content_navbar.html',
      title='Manage Navbar',
      html_class='manage-navbar',
    )


@app.route('/admin/content/media')
@auth.admin_required
def admin_content_media():
  return flask.render_template(
      'content/content_media.html',
      title='Manage media',
      html_class='manage-media',
    )


###############################################################################
# Config Stuff
###############################################################################
class ConfigUpdateForm(wtf.Form):
  analytics_id = wtforms.StringField(model.Config.analytics_id._verbose_name, filters=[util.strip_filter])
  announcement_html = wtforms.TextAreaField(model.Config.announcement_html._verbose_name, filters=[util.strip_filter])
  announcement_type = wtforms.SelectField(model.Config.announcement_type._verbose_name, choices=[(t, t.title()) for t in model.Config.announcement_type._choices])
  anonymous_recaptcha = wtforms.BooleanField(model.Config.anonymous_recaptcha._verbose_name)
  brand_name = wtforms.StringField(model.Config.brand_name._verbose_name, [wtforms.validators.required()], filters=[util.strip_filter])
  bucket_name = wtforms.StringField(model.Config.bucket_name._verbose_name, filters=[util.strip_filter])
  check_unique_email = wtforms.BooleanField(model.Config.check_unique_email._verbose_name)
  email_authentication = wtforms.BooleanField(model.Config.email_authentication._verbose_name)
  feedback_email = wtforms.StringField(model.Config.feedback_email._verbose_name, [wtforms.validators.optional(), wtforms.validators.email()], filters=[util.email_filter])
  flask_secret_key = wtforms.StringField(model.Config.flask_secret_key._verbose_name, [wtforms.validators.optional()], filters=[util.strip_filter])
  notify_on_new_user = wtforms.BooleanField(model.Config.notify_on_new_user._verbose_name)
  recaptcha_private_key = wtforms.StringField(model.Config.recaptcha_private_key._verbose_name, filters=[util.strip_filter])
  recaptcha_public_key = wtforms.StringField(model.Config.recaptcha_public_key._verbose_name, filters=[util.strip_filter])
  salt = wtforms.StringField(model.Config.salt._verbose_name, [wtforms.validators.optional()], filters=[util.strip_filter])
  verify_email = wtforms.BooleanField(model.Config.verify_email._verbose_name)

