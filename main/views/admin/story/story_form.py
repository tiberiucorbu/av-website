from flask.ext import wtf
import wtforms
from views import  ListField

class StoryForm(wtf.Form):
  title = wtforms.StringField('Title', [wtforms.validators.required()])
  description = wtforms.StringField(
      'Description', [wtforms.validators.optional()])
  tags = ListField('Tags', [wtforms.validators.optional()])
  story_items = ListField('Items Keys', [wtforms.validators.optional()])
  canonical_path = wtforms.StringField(
      'Canonical Path', [wtforms.validators.optional()])
  meta_keywords = wtforms.StringField(
      'Meta Kewords', [wtforms.validators.optional()])
  meta_description = wtforms.StringField(
      'Meta Description', [wtforms.validators.optional()])
  deprecated_category_id = wtforms.IntegerField(
      'Old Category Id', [wtforms.validators.optional()])
  deprecated_category_data = wtforms.StringField(
      'Old Category Data', [wtforms.validators.optional()])
