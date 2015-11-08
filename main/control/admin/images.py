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
@app.route('/admin/images')
@auth.admin_required
def admin_images_navbar():
  return flask.render_template(
      'admin/images/images.html',
      title='Manage Images',
      html_class='manage-images',
    )
