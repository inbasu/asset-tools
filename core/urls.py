# from django.contrib import admin
from django.urls import include, path

from core import settings
from django.conf.urls.static import static

urlpatterns = [
    # path("admin/", admin.site.urls),
    path("api/printers/", include("print_service.urls")),
    path("", include("web.urls")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
