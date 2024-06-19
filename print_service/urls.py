from django.urls import path
from django.urls.resolvers import URLPattern

from print_service.views import PrinterListView, PrinterRunView, PrinterUpdate
# TODO:
# [*] move printers logic to itself app
# [] create frontend to check and delete priters


urlpatterns: list[URLPattern] = [
    path("list/", PrinterListView.as_view()),
    path("run/", PrinterRunView.as_view()),
    path("update/", PrinterUpdate.as_view()),
]
