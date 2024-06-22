from django.core.exceptions import PermissionDenied
from rest_framework import BasePermission


# Permission classe for API
class ItUserPermission(BasePermission):
    message = "IT roles only"
    roles = {}

    def has_permission(self, request, view) -> bool:
        user = request.session.get("user", False)
        return bool(user) and bool([role for role in user["roles"] if role in self.roles])


class UserWithStorePermission(BasePermission):
    message = "With store assigned only"

    def has_permission(self, request, view):
        user = request.session.get("user", False)
        return bool(user) and bool([role for role in user["store_role"]])


#  Methods mixins for standart views
class IsUserMixin:
    def dispatch(self, request):
        if user := request.session.get("user", False):
            return bool(user.roles) or bool(user.store_role)
        return PermissionDenied("Who are you")


class IsITMixin:
    def dispatch(self, request):
        roles = {}
        if user := request.session.get("user", False):
            return bool(set(user.roles) & roles)
        return PermissionDenied("No, you are not IT")


class IsInventAdminAdminMixin:
    def dispatch(self, request):
        roles = {}
        if user := request.session.get("user", False):
            return bool(set(user.roles) & roles)
        return PermissionDenied("No, you are not Invent admin")
