from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK


from users.permissions import ITUserPermission, ITInventAdminPermission


class IventoryView(APIView):
    def get(self, request):
        return Response({})


class InventoryItemsView(APIView):
    http_method_names = ["post"]
    permission_classes = [ITUserPermission | ITInventAdminPermission]

    def post(self, request):
        if inventory := request.data.get("inventory", False):
            return Response({}, status=HTTP_200_OK)
        return Response({}, status=HTTP_400_BAD_REQUEST)
