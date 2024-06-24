from django.http import HttpResponse
from rest_framework.views import APIView


# Create your views here.
class DownloadMoblieBlank(APIView):
    http_method_names = ["post"]

    def post(self, request):
        return HttpResponse()
