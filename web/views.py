from django.views.generic import TemplateView
from users.IDAM import IDAMMixin
from users.permissions import IsUserMixin, IsITMixin


# Create your views here.
class IndexView(IDAMMixin, IsUserMixin, TemplateView):
    template_name = "index.html"


class MobileView(IDAMMixin, TemplateView):
    template_name = "index.html"


class ITInventView(IDAMMixin, IsITMixin, TemplateView):
    template_name = "index.html"


class PrintersView(IDAMMixin, TemplateView):
    template_name = "index.html"
