from google.appengine.ext import ndb
import model

class Story(model.Base):
  user_key = ndb.KeyProperty(kind=model.User, required=True)
  title = ndb.StringProperty(required=True)
  description = ndb.StringProperty(default='')
  meta_keywords = ndb.StringProperty(default='')
  meta_description = ndb.StringProperty(default='')