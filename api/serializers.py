from rest_framework.serializers import ModelSerializer

from api.models import Printer


class PrinterSerializer(ModelSerializer):
    class Meta:
        model = Printer
        fields = ["name", "ip"]
