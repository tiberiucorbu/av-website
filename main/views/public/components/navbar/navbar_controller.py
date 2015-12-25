from views.public.common import *
@app.route('/_sub/navbar')
def navbar():
  resp_model = {}
  resp_model['extern'] = True
  decorate_navbar_model(resp_model)
  return flask.render_template('public/components/navbar/navbar.html', model=resp_model)
