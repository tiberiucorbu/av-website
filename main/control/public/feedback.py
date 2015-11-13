# coding: utf-8

from flask.ext import wtf
import flask
import wtforms

import auth
import config
import task
import util

from main import app


class FeedbackForm(wtf.Form):
  message = wtforms.TextAreaField(
      'Message',
      [wtforms.validators.required()], filters=[util.strip_filter],
  )
  name = wtforms.StringField(
      'Email',
      [wtforms.validators.required(), wtforms.validators.email()],
      filters=[util.email_filter],
  )
  email = wtforms.StringField(
      'Email',
      [wtforms.validators.required(), wtforms.validators.email()],
      filters=[util.email_filter],
  )
  subject = wtforms.StringField(
        'Subject',
        [wtforms.validators.required(), wtforms.validators.email()],
        filters=[util.email_filter],
    )
  recaptcha = wtf.RecaptchaField()


@app.route('/feedback/', methods=['GET', 'POST'])
def feedback():
  if not config.CONFIG_DB.feedback_email:
    return flask.abort(418)

  feedback_form = FeedbackForm(obj=auth.current_user_db())
  if not config.CONFIG_DB.has_anonymous_recaptcha or auth.is_logged_in():
    del feedback_form.recaptcha
  if feedback_form.validate_on_submit():
    body = '%s\n\n%s' % (feedback_form.message.data, feedback_form.email.data)
    kwargs = {
        'reply_to': feedback_form.email.data} if feedback_form.email.data else {}
    task.send_mail_notification('%s...' % body[:48].strip(), body, **kwargs)
    flask.flash('Thank you for your feedback!', category='success')
    return flask.redirect(flask.url_for('home'))

  model = {
      title: 'Feedback',
      html_class: 'feedback',
      feedback_form: feedback_form
  }
  return flask.render_template(
      'public/feedback/feedback.html',
      model=respone_model
  )
