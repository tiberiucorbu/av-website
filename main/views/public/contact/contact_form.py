# coding: utf-8

import wtforms
from flask.ext import wtf
import util

class ContactForm(wtf.Form):
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
