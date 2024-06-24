from django.http import HttpResponse
from django.views.generic import TemplateView
from django.template.loader import get_template
from rest_framework.views import APIView


from io import BytesIO
from django.http import HttpResponse
from xhtml2pdf import pisa


# Create your views here.
class DownloadMoblieBlank(APIView):
    http_method_names = ["get"]

    def get(self, request):
        template = get_template("utils/takeback.html")
        html = template.render()
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(html.encode("utf-8")), result)
        return HttpResponse(result.getvalue(), content_type="application/pdf")


class TackebakView(TemplateView):
    template_name = "utils/takeback.html"
