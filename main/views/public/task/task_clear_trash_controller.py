import flask

from main import app

import model

from google.appengine.ext import ndb
from google.appengine.ext import blobstore
from views.public.common import *
from google.appengine.ext import deferred


@app.route('/tasks/clear-trash')
def task_clear_trash():
    deferred.defer(trash_stories)
    #    model.Resource()
    return flask.render_template('public/task/task.html')


# @ndb.transactional(xg=True)
def trash_stories():
    deleted_story_db = model.Story.get_trashed().fetch()
    for story in deleted_story_db:
        resource_items = ndb.get_multi(story.story_items)
        for item in resource_items:
            delete_resource_key(item)
        story.key.delete()


def delete_resource_key(resource_db):
    if resource_db and blobstore.BlobInfo.get(resource_db.blob_key):
        blobstore.BlobInfo.get(resource_db.blob_key).delete()
        resource_db.key.delete()
