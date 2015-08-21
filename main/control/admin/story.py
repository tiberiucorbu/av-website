from flask.ext import wtf
import wtforms

import flask
import auth
import model
from main import app



@app.route('/admin/content/stories')
@auth.admin_required
def admin_content_stories():
  return flask.render_template(
      'content/content_story_list.html',
      title='Manage stories',
      html_class='manage-stories',
    )


@app.route('/admin/content/create-story', methods=['GET', 'POST'])
@auth.admin_required
def story_create():
  form = StoryUpdateForm()
  if form.validate_on_submit():
    story_db = model.Story(
        user_key=auth.current_user_key(),
        title=form.title.data,
        description = form.description.data,
        meta_keywords = form.meta_keywords.data,
        meta_description = form.meta_keywords.data
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
  description = wtforms.StringField('Description', [wtforms.validators.optional()])
  meta_keywords = wtforms.StringField('Meta Kewords', [wtforms.validators.optional()])
  meta_description = wtforms.StringField('Meta Description', [wtforms.validators.optional()])
