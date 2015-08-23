from flask.ext import wtf
import wtforms

import flask
import auth
import model
from main import app
import util


@app.route('/admin/content/stories', endpoint='story_list')
@auth.admin_required
def admin_content_stories():
  story_dbs, story_cursor = model.Story.get_dbs()
  return flask.render_template(
      'content/content_story_list.html',
      title='Manage stories',
      story_dbs=story_dbs,
      next_url=util.generate_next_url(story_cursor),
      prev_url=util.generate_prev_url(story_cursor),
      html_class='manage-stories',
      api_url=flask.url_for('api.story.list')
  )


@app.route('/admin/content/story-update/<int:story_id>', methods=['GET', 'POST'])
@auth.admin_required
def story_update(story_id):
  story_db = model.Story.get_by_id(story_id)
  if not story_db:
    flask.abort(404)
  form = StoryUpdateForm(obj=story_db)
  if form.validate_on_submit():
    form.populate_obj(story_db)
    story_db.put()
    return flask.redirect(flask.url_for('admin_content_stories', order='-modified'))
  return flask.render_template(
      'content/content_story_update.html',
      html_class='story-update',
      title=story_db.title,
      form=form,
      story_db=story_db,
  )


@app.route('/admin/content/story-create', methods=['GET', 'POST'])
@auth.admin_required
def story_create():
  form = StoryUpdateForm()
  if form.validate_on_submit():
    story_db = model.Story(
        user_key=auth.current_user_key(),
        title=form.title.data,
        description=form.description.data,
        meta_keywords=form.meta_keywords.data,
        meta_description=form.meta_keywords.data
    )
    story_db.put()
    return flask.redirect(flask.url_for('admin_content_stories'))

  return flask.render_template(
      'content/content_story_create.html',
      html_class='story-create',
      title='Create a new story',
      form=form,
  )


class StoryUpdateForm(wtf.Form):
  title = wtforms.StringField('Title', [wtforms.validators.required()])
  description = wtforms.StringField(
      'Description', [wtforms.validators.optional()])
  meta_keywords = wtforms.StringField(
      'Meta Kewords', [wtforms.validators.optional()])
  meta_description = wtforms.StringField(
      'Meta Description', [wtforms.validators.optional()])
