from django.urls import path

from web.views import IndexView, MobileView, PrintersView, ITInventView

urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("mobile/", MobileView.as_view(), name="mobile"),
    path("it-invent/", ITInventView.as_view(), name="it-invent"),
    path("printers/", PrintersView.as_view(), name="printeres"),
]
