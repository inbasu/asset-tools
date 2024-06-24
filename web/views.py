from django.views.generic import TemplateView
from django.shortcuts import render

from users.IDAM import IDAMMixin


# Create your views here.
class IndexView(IDAMMixin, TemplateView):
    template_name = "index.html"


class MobileView(IDAMMixin, TemplateView):
    template_name = "index.html"


class PrintersView(IDAMMixin, TemplateView):
    template_name = "index.html"
