from django.db import models

from django.utils.safestring import mark_safe
from model_utils.models import TimeStampedModel
from raven_apps.utils.json_helper import format_pretty_for_html

# Create your models here.
ZELIG_APP = 'zelig'

class TestCallCapture(TimeStampedModel):

    app_name = models.CharField(max_length=255)

    outgoing_url = models.URLField(blank=True)
    request = models.TextField(blank=True)

    response = models.TextField(blank=True)
    status_code = models.CharField(max_length=50, blank=True)
    success = models.BooleanField(default=False)

    def __str__(self):
        return '%s - (%s)' % (self.app_name, self.created)

    class Meta:
        ordering = ('-created',)

    def request_json(self):
        if not self.request:
            return 'n/a'

        pretty_json = format_pretty_for_html(self.request)
        return mark_safe(pretty_json)

    def response_json(self):
        if not self.response:
            return 'n/a'
        pretty_json = format_pretty_for_html(self.response)
        return mark_safe(pretty_json)
