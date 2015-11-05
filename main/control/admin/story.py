from flask.ext import wtf
import wtforms

import flask
import auth
import model
from main import app
import util


@app.route('/admin/stories', endpoint='admin_stories')
@auth.admin_required
def admin_stories():
  return flask.render_template(
      'admin/story/story.html',
      title='Manage stories'
  )
