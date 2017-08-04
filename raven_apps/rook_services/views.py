from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse, HttpResponse, Http404

# Create your views here.
def view_test_route(request):
    return HttpResponse('ok')
