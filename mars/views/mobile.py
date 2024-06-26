from rest_framework.views import APIView
from rest_framework.response import Response
from abc import ABC, abstractmethod

from mars.premissions import UserWithStorePermission, ItUserPermission


class BaseView(APIView, ABC):
    permission_classes = [UserWithStorePermission | ItUserPermission]
    item_types = []

    def form_iql(self, request) -> str:
        return ""

    @abstractmethod
    def post(self, request): ...


class GiveawayView(BaseView):
    def post(self, request):
        return Response({})


class TakeBackView(BaseView):
    def post(self, request):
        return Response({})


class SendView(BaseView):
    def post(self, request):
        return Response({})
