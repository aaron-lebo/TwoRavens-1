from django.conf.urls import url
from tworaven_apps.rook_services import views

urlpatterns = (

    #url(r'^{0}'.format(ZELIG_APP),
    #    views.view_zelig_route,
    #    name='view_zelig_route'),

    url(r'^(?P<app_name_in_url>\w{5,25})/?$',
        views.view_rook_route,
        name='view_rook_route'),
)
