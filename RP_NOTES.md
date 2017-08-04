
## Proof of concept to wrap application in Django

- 1st step, route a UI requests through Django to Rook instead of directly to Rook
  - For prototype, the chart images will still be served directly from Rook

- Eventual goal is to have Rook/R functions to be a separate service, likely a separate repository


# postactive

Open the postactive file:

```
atom $VIRTUAL_ENV/bin/postactivate
```

Add this line to the end of the file:

```
export DJANGO_SETTINGS_MODULE=tworavensproject.settings.local_settings
```
