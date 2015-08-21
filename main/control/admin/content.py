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


@app.route('/admin/content/story-items')
@auth.admin_required
def admin_content_story():
  return flask.render_template(
      'content/content_media.html',
      title='Manage story items',
      html_class='story-items',
    )
