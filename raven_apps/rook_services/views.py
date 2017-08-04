import requests

from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse, HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt, csrf_protect


# Create your views here.
@csrf_exempt
def view_test_zelig_route(request):

    if (not request.POST) or (not 'solaJSON' in request.POST):
        return JsonResponse(dict(status="ERROR", message="solaJSON key not found"))

    # Make a dict to send info only R zeligapp
    #
    zeligapp_data = dict(solaJSON=request.POST['solaJSON'])

    # Call zelig
    #
    r = requests.post(settings.URL_ZELIG_APP,
                      data=zeligapp_data)


    print (40 * '=')
    print (r.text)
    #d = r.json()
    #print (json.dumps(d, indent=4))
    print (r.status_code)

    return HttpResponse(r.text)



# example of incoming POST from TwoRavens
"""
<QueryDict: {'solaJSON': ['{"zdata":"fearonLaitinData.tab","zedges":[["country","ccode"],["ccode","cname"]],"ztime":[],"znom":["country"],"zcross":[],"zmodel":"","zvars":["ccode","country","cname"],"zdv":["cname"],"zdataurl":"","zsubset":[["",""],[],[]],"zsetx":[["",""],["",""],["",""]],"zmodelcount":0,"zplot":[],"zsessionid":"","zdatacite":"Dataverse, Admin, 2015, \\"Smoke test\\", http://dx.doi.org/10.5072/FK2/WNCZ16,  Root Dataverse,  V1 [UNF:6:iuFERYJSwTaovVDvwBwsxQ==]","zmetadataurl":"http://127.0.0.1:8080/static/data/fearonLaitin.xml","zusername":"rohit","callHistory":[],"allVars":["durest","aim","casename","ended","ethwar","waryrs","pop","lpop","polity2","gdpen","gdptype","gdpenl","lgdpenl1","lpopl1","region"]}']}>
"""
