from flask.ext import wtf
import wtforms

import flask
import auth
import model
from main import app
import util


@app.route('/admin/pages', endpoint='admin_pages')
@auth.admin_required
def admin_pages():
  return flask.render_template(
      'admin/pages/pages.html',
      title=' pages'
  )
