# from django.contrib import admin
from django.urls import include, path

from core import settings

urlpatterns = [
    # path("admin/", admin.site.urls),
    path("api/printers/", include("print_service.urls")),
    path("", include("web.urls")),
    path("utils/", include("utils.urls")),
]

# development

if settings.DEBUG:
    from django.conf.urls.static import static

    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
