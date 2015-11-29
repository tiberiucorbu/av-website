from flask.ext import wtf
import wtforms

import flask
import auth
import model
from main import app
import util


@app.route('/admin/share', endpoint='admin_share')
@auth.admin_required
def admin_share():
  return flask.render_template(
      'admin/share/share.html',
      title='Share configurator'
  )
