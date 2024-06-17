from rest_framework.serializers import ModelSerializer

from print_service.models import Printer


class PrinterSerializer(ModelSerializer):
    class Meta:
        model = Printer
        fields = ["name", "ip"]
