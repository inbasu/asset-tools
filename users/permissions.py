from django.core.exceptions import PermissionDenied


class IsUserMixin:
    def dispatch(self, request):
        if user := request.session.get("user", False):
            return bool(user["roles"]) or bool(user["store_role"])
        return PermissionDenied("Who are you")


class IsITMixin:
    def dispatch(self, request):
        roles = {}
        if user := request.session.get("user", False):
            return bool(set(user["roles"]) & roles)
        return PermissionDenied("No, you are not IT")
