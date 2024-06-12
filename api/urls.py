from django.urls import path
from django.urls.resolvers import URLPattern

from api.views import PrinterListView, PrinterRunView, PrinterUpdate

urlpatterns: list[URLPattern] = [
    path("printers/", PrinterListView.as_view()),
    path("printer/run/", PrinterRunView.as_view()),
    path("print/update/", PrinterUpdate.as_view()),
]
