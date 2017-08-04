from __future__ import absolute_import
import json
import sys
from os import makedirs
from os.path import join, normpath, isdir, isfile

from .base import *

SECRET_KEY = 'ye-local-laptop-secret-key'

LOCAL_SETUP_DIR = join(BASE_DIR, 'test_setup')
if not isdir(LOCAL_SETUP_DIR):
    makedirs(LOCAL_SETUP_DIR)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': join(LOCAL_SETUP_DIR, 'two_ravens1.db3'),
    }
}

SESSION_COOKIE_NAME = 'two_ravens_local'

# where static files are collected
STATIC_ROOT = join(LOCAL_SETUP_DIR, 'staticfiles')
if not isdir(STATIC_ROOT):
    makedirs(STATIC_ROOT)


# http://django-debug-toolbar.readthedocs.org/en/latest/installation.html
INTERNAL_IPS = ('127.0.0.1',)

INSTALLED_APPS += ['debug_toolbar']
########## END TOOLBAR CONFIGURATION

MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']

MEDIA_ROOT = join(LOCAL_SETUP_DIR, "media")

MEDIA_URL = '/media/'
