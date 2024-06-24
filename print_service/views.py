from django.views.generic import TemplateView
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView

from print_service.models import Printer
from print_service.serializers import PrinterSerializer


# Create your views here.
class PrinterListView(APIView):
    renderer_classes = [JSONRenderer]
    http_method_names = ["get"]

    def get(self, request) -> Response:
        data = Printer.objects.all()
        # There is no regext in sqlite so little fint
        for exp in request.GET.get("mask", "").split("*"):
            data = data.filter(name__contains=exp)
        serializer = PrinterSerializer(data, many=True)
        return Response(serializer.data, status=HTTP_200_OK)


class PrinterRunView(APIView):
    """note that now we print less then 30 lables"""

    renderer_classes = [JSONRenderer]
    http_method_names = ["post"]

    def post(self, request) -> Response:
        printer = request.data.get("PrinterName", "")
        data = request.data.get("data", "")
        try:
            printer = Printer.objects.get(name=printer).print(data)
            if not printer.online():
                raise Exception("Printer offline")
            labels = []

            # TODO: celery task
            for label in labels:
                printer.print(label)
            return Response({}, status=HTTP_200_OK)
        except Exception as e:
            return Response({"err": e}, status=HTTP_400_BAD_REQUEST)


class PrinterUpdate(APIView):
    renderer_classes = [JSONRenderer]
    http_method_names = ["post"]

    def post(self, request):
        Printer.update()  # TODO: celery task
        return Response({"result": "Printers update was launched"}, status=HTTP_200_OK)


class WebView(TemplateView):
    template_name = "/index.html"
    http_method_names = ["get"]
