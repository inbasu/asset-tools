from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.views import APIView

from mars.models import InsightEntity
from users.permissions import ItUserPermission

""" It's calles it.py coz of permissions not app based """


# Create your views here.
class IQLRunView(APIView):
    http_method_names = ["post"]
    permission_classes = [ItUserPermission]

    def post(self, request) -> Response:
        if entity := request.data.get("object", False):
            data = InsightEntity.objects.get(name=entity).search_object(iql=request.data.grt("iql", ""))
            return Response(data, status=HTTP_200_OK)
        return Response({})


class UpdateRunView(APIView):
    http_method_names = ["post"]
    permission_classes = [ItUserPermission]

    def post(self, request) -> Response:
        return Response({}, status=HTTP_200_OK)


class CreateRunView(APIView):
    http_method_names = ["post"]
    permission_classes = [ItUserPermission]

    def post(self, request) -> Response:
        return Response({}, status=HTTP_200_OK)
