from django.urls import path

from web.views import IndexView, PrinterView, MobileView


urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("mobile/", MobileView.as_view(), name="mobile"),
    path("printers/", PrinterView.as_view(), name="printeres"),
]
