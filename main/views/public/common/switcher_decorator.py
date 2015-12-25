import model
import util
import flask

def decorate_view_reduced_switcher(resp_model):
    view = util.param('v', str)
    resp_model['view_reduced'] = False
    if view == 'r':
      resp_model['view_reduced'] = True
