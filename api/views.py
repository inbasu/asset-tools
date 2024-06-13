from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

from django.views.generic import TemplateView


from api.models import Printer
from api.serializers import PrinterSerializer


# Create your views here.
class PrinterListView(APIView):
    renderer_classes = [JSONRenderer]
    http_method_names = ["get"]

    def get(self, request) -> Response:
        data = Printer.objects.filter(name=request.GET.get("mask", ""))
        serializer = PrinterSerializer(data, many=True)
        return Response(serializer.data, status=HTTP_200_OK)


class PrinterRunView(APIView):
    renderer_classes = [JSONRenderer]
    http_method_names = ["post"]

    def post(self, request) -> Response:
        printer = request.data.get("PrinterName", "")
        data = request.data.get("data", "")
        try:
            result = Printer.objects.get(name=printer).print(data)
            """ Here  we got item data and print in with celery
                Printer can have only 30 labels in queue
                Split items by 30 in task and send it with deley"""
            return Response(result, status=HTTP_200_OK)
        except Exception:
            return Response({}, status=HTTP_400_BAD_REQUEST)


class PrinterUpdate(APIView):
    renderer_classes = [JSONRenderer]
    http_method_names = ["post"]

    def post(self, request):
        Printer.update()  # celery task
        return Response({"result": "Printers update was launched"}, status=HTTP_200_OK)


class WebView(TemplateView):
    template_name = "api/index.html"
    http_method_names = ["get"]
