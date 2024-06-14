from django.urls import path
from django.urls.resolvers import URLPattern

from api.views import PrinterListView, PrinterRunView, PrinterUpdate
# TODO:
# [] move printers logic to itself app


urlpatterns: list[URLPattern] = [
    path("printers/list/", PrinterListView.as_view()),
    path("printers/run/", PrinterRunView.as_view()),
    path("printers/update/", PrinterUpdate.as_view()),
]
