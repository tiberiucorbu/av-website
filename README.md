AV Website
==========

A showcase website for a photographer.

Forked from the gae-init-upload sandbox.

Running the Development Environment
-----------------------------------

```
$ cd /path/to/project-name
$ gulp
```

To test it visit `http://localhost:8080/` in your browser.

---

For a complete list of commands:

```
$ gulp help
```

Initializing or Resetting the project
-------------------------------------

```
$ cd /path/to/project-name
$ npm install
$ gulp
```

If something goes wrong you can always do:

```
$ gulp reset
$ npm install
$ gulp
```

---

To install [Gulp](http://gulpjs.com) as a global package:

```
$ npm install -g gulp
```

Deploying on Google App Engine
------------------------------

```
$ gulp deploy
```

Before deploying make sure that the `main/app.yaml` and `gulp/config.coffee` are up to date.

Tech Stack
----------

-	[Google App Engine](https://developers.google.com/appengine/), [NDB](https://developers.google.com/appengine/docs/python/ndb/)
-	[Jinja2](http://jinja.pocoo.org/docs/), [Flask](http://flask.pocoo.org/), [Flask-RESTful](https://flask-restful.readthedocs.org), [Flask-WTF](https://flask-wtf.readthedocs.org)
-	[CoffeeScript](http://coffeescript.org/), [Less](http://lesscss.org/)
-	[Bootstrap](http://getbootstrap.com/), [Font Awesome](http://fortawesome.github.com/Font-Awesome/), [Social Buttons](http://lipis.github.io/bootstrap-social/)
-	[jQuery](http://jquery.com/), [NProgress](http://ricostacruz.com/nprogress/), [Moment.js](http://momentjs.com/)
-	[OpenID](http://en.wikipedia.org/wiki/OpenID) sign in (Google, Facebook, Twitter)
-	[Python 2.7](https://developers.google.com/appengine/docs/python/python27/using27), [pip](http://www.pip-installer.org/), [virtualenv](http://www.virtualenv.org/)
-	[Gulp](http://gulpjs.com), [Bower](http://bower.io/)

Requirements
------------

-	[Google App Engine SDK for Python](https://developers.google.com/appengine/downloads)
-	[Node.js](http://nodejs.org/), [pip](http://www.pip-installer.org/), [virtualenv](http://www.virtualenv.org/)
-	[OSX](http://www.apple.com/osx/) or [Linux](http://www.ubuntu.com) or [Windows](http://windows.microsoft.com/)

Contributions and Ideas
-----------------------

-	[tzador](http://stackoverflow.com/users/165697/tzador)
-	[chris](http://stackoverflow.com/users/226394/chris-top)
-	[ksymeon](https://plus.google.com/102598378133436784997)
-	[gmist](https://github.com/gmist)
-	[stefanlindmark](http://www.linkedin.com/in/stefanlindmark)
-	[joernhees](https://github.com/joernhees)
-	[xcash](https://github.com/xcash)
-	[mdxs](https://github.com/mdxs)

Author
------

[![Tiberiu flair on stackoverflow.com][tiberiu-corbu]][tiberiu]
