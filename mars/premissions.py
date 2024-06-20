from rest_framework.permissions import BasePermission


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
