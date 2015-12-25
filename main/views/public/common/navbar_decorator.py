from main import app
import model
import util
import json
from google.appengine.ext import ndb
from google.appengine.api import memcache
import flask



def decorate_navbar_model(resp_model):
    main_navbar_data = memcache.get('main-navbar')
    if main_navbar_data is None:
        # Add navbar data
      main_navbar_db = model.ModuleConfig.get_by('module_id', 'main-navbar')
      if main_navbar_db is not None and main_navbar_db.config is not None:
        main_navbar_data = json.loads(main_navbar_db.config)
        extern = util.get_if_exists(resp_model, 'extern', False)
        expand_links(main_navbar_data, extern)
        memcache.add('main-navbar', main_navbar_data, 3600)
    resp_model['navbar'] = main_navbar_data

def expand_links(parentItem, extern=False):
  if isinstance(parentItem, list):
    for item in parentItem:
      expand_links(item, extern)
  else:
    modelType = util.get_if_exists(parentItem, 'modelType', None)
    if 'story' == modelType:
      story_key = None
      keyStr = util.get_if_exists(parentItem, 'key', None)
      if not util.is_blank(keyStr):
        story_db = ndb.Key(urlsafe=keyStr).get()
        if story_db:
          parentItem['url'] = flask.url_for(
              'story', story_key=util.story_key(story_db), _external=extern)
    if 'page' == modelType:
      keyStr = util.get_if_exists(parentItem, 'url_component', 'home')
      try:
        parentItem['url'] = flask.url_for(keyStr, _external=extern)
      except routing.BuildError:
        parentItem['url'] = flask.url_for('home', _external=extern)
    if 'nodes' in parentItem:
      expand_links(parentItem['nodes'], extern)
