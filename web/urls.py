from django.urls import path

from web.views import IndexView, MobileView, PrintersView

urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("mobile/", MobileView.as_view(), name="mobile"),
    path("printers/", PrintersView.as_view(), name="printeres"),
]
