import model
import util
import json
from google.appengine.ext import ndb
from google.appengine.api import memcache
import flask


def decorate_footer_model(resp_model):
    # Add footer data
    share_config_db = model.ModuleConfig.get_by('module_id', 'share-config')
    if share_config_db and share_config_db.config:
        share_data = json.loads(share_config_db.config)
        resp_model['share_profiles'] = share_data
