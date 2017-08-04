from django.conf.urls import url
from raven_apps.rook_services import views

urlpatterns = (

    url(r'^zeligapp',
        views.view_test_route,
        name='view_test_route'),
)
