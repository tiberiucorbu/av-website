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
@app.route('/admin/')
@auth.admin_required
def admin():
  return flask.render_template(
      'admin/dashboard/dashboard.html',
      title='Admin',
      html_class='admin',
    )
