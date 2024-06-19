from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import BasePermission

from mars.models import InsightEntity


# Create your views here.
class UserPermission(BasePermission):
    def has_permission(self, request, view) -> bool:
        return request.session.get("user", False)


class IQLRunView(APIView):
    http_method_names = ["post"]
    permission_classes = [UserPermission]

    def post(self, request) -> Response:
        if entity := request.data.get("object", False):
            data = InsightEntity.objects.get(name=entity).search_object(iql=request.data.grt("iql", ""))
            return Response(data, status=HTTP_200_OK)
        return Response({})


class UpdateRunView(APIView):
    http_method_names = ["post"]
    permission_classes = [UserPermission]

    def post(self, request) -> Response:
        return Response({}, status=HTTP_200_OK)


class CreateRunView(APIView):
    http_method_names = ["post"]
    permission_classes = [UserPermission]

    def post(self, request) -> Response:
        return Response({}, status=HTTP_200_OK)
