from . import *

def decorate_page_response_model(resp_model):
  decorate_navbar_model(resp_model)
  decorate_page_meta(resp_model)
  decorate_view_reduced_switcher(resp_model)
