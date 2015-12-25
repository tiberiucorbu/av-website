from main import app
import model
import util
import json
from google.appengine.ext import ndb
import flask

def decorate_page_meta(resp_model):
  resp_model['host'] = flask.url_for('home', _external=True)[:-1]

  home_page_db = model.ModuleConfig.get_by('module_id', 'home-page')
  if not 'db_obj' in resp_model:
    resp_model['db_obj'] = home_page_db
  decorate_from_model(resp_model)
  if home_page_db is not None and home_page_db.config is not None:
    home_page_data = json.loads(home_page_db.config)
    resp_model['page_data'] = home_page_data

def decorate_from_model(resp_model):
  if 'db_obj' in resp_model:
    if  isinstance(resp_model['db_obj'], model.meta.page_meta.PageMeta):
      db_obj = resp_model['db_obj']
      resp_model['meta'] = {'keywords': db_obj.meta_keywords, 'description':  db_obj.meta_description}
