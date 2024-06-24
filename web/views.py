from django.views.generic import TemplateView
from users.IDAM import IDAMAuthMixin
from users.permissions import IsUserMixin, IsITMixin


# Create your views here.
class IndexView(IDAMAuthMixin, IsUserMixin, TemplateView):
    template_name = "index.html"


class MobileView(IDAMAuthMixin, TemplateView):
    template_name = "index.html"


class ITInventView(IDAMAuthMixin, IsITMixin, TemplateView):
    template_name = "index.html"


class PrintersView(IDAMAuthMixin, TemplateView):
    template_name = "index.html"


# Error pages
