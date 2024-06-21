from django.views.generic import TemplateView


# Create your views here.
class IndexView(TemplateView):
    template_name = "index.html"


class MobileView(TemplateView):
    template_name = "index.html"


class PrinterView(TemplateView):
    template_name = "index.html"
