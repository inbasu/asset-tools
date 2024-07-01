from rest_framework.views import APIView
from rest_framework.response import Response
from abc import ABC, abstractmethod

from mars.premissions import UserWithStorePermission, ITUserPermission


class BaseView(APIView, ABC):
    permission_classes = [UserWithStorePermission | ITUserPermission]
    item_types = []

    def form_iql(self, request) -> str:
        return ""

    @abstractmethod
    def post(self, request): ...


class GiveawayItemsView(BaseView):
    def post(self, request):
        return Response({})


class TakeBackItemsView(BaseView):
    def post(self, request):
        return Response({})


class SendItemsView(BaseView):
    def post(self, request):
        return Response({})
