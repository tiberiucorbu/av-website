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
# Admin route for navbar
###############################################################################
@app.route('/admin/navbar')
@auth.admin_required
def admin_content_navbar():
  return flask.render_template(
      'admin/navbar/navbar.html',
      title='Manage Navbar',
      html_class='manage-navbar',
    )
