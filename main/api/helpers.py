# coding: utf-8

from datetime import datetime
import flask
from flask.ext import restful
import logging
from werkzeug import exceptions

import util


class Api(restful.Api):
    def unauthorized(self, response):
        flask.abort(401)

    def handle_error(self, e):
        return handle_error(e)


def handle_error(e):
    if not e:
        e = {}
    else:
        logging.exception(e)

    try:
        e.code
    except AttributeError:
        e.code = 500
        e.name = e.description = 'Internal Server Error'
    result = {
        'status': 'error',
        'error_code': e.code,
        'error_name': util.slugify(e.name),
        'error_message': e.name,
        'error_class': e.__class__.__name__,
        'description': e.description,
        'data': None,
        'validations': None
    }
    if hasattr(e, 'data'):
        result['data'] = e.data
    if hasattr(e, 'validations'):
        result['validations'] = e.validations
    return util.jsonpify(result), e.code


def make_invalid_form_response(data=[], validations=[]):
    exception = exceptions.BadRequest()
    exception.data = data
    exception.validations = validations
    raise exception


def make_response(data, marshal_table, cursors=None):
    if util.is_iterable(data):
        response = {
            'status': 'success',
            'count': len(data),
            'now': datetime.utcnow().isoformat(),
            'result': map(lambda l: restful.marshal(l, marshal_table), data),
        }
        if cursors:
            if isinstance(cursors, dict):
                if cursors.get('next'):
                    response['next_cursor'] = cursors['next']
                    response['next_url'] = util.generate_next_url(cursors['next'])
                if cursors.get('prev'):
                    response['prev_cursor'] = cursors['prev']
                    response['prev_url'] = util.generate_next_url(cursors['prev'])
            else:
                response['next_cursor'] = cursors
                response['next_url'] = util.generate_next_url(cursors)
        return util.jsonpify(response)
    return util.jsonpify({
        'status': 'success',
        'now': datetime.utcnow().isoformat(),
        'result': restful.marshal(data, marshal_table),
    })


def make_object_response(obj):
    return util.jsonpify({
        'status': 'success',
        'now': datetime.utcnow().isoformat(),
        'result': obj
    })


def make_not_found_exception(description):
    exception = exceptions.NotFound()
    exception.description = description
    raise exception


def make_bad_request_exception(description):
    exception = exceptions.BadRequest()
    exception.description = description
    raise exception
