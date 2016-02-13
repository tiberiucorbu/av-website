from views.public.common import *

from flask import make_response


@app.route('/_sub/footer')
def footer():
    resp_model = {}
    resp_model['extern'] = True
    decorate_footer_model(resp_model)
    response = flask.make_response(flask.render_template('public/components/footer/footer.html',
                                                         model=resp_model))
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
