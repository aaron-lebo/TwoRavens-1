
## Proof of concept to wrap application in Django

- 1st step, route a UI requests through Django to Rook instead of directly to Rook
  - For prototype, the chart images will still be served directly from Rook

- Eventual goal is to have Rook/R functions to be a separate service

# Basic zelig routing working with:

(Note: this requires a fair amount of setup not documented for prototype--running python 3)

```
python manage.py runserver 8080 # run django dev. server
```

Static file served: http://127.0.0.1:8080/static/gui.html
  - in future, the "gui.html" would become a template to allow sessions, menus, features, etc


# postactive

Open the postactive file:

```
atom $VIRTUAL_ENV/bin/postactivate
```

Add this line to the end of the file:

```
export DJANGO_SETTINGS_MODULE=tworavensproject.settings.local_settings
```
