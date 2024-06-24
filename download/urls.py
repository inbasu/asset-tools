from django.urls import path

from download.views import DownloadPDFMobile

urlpatterns = [
    path("mobile-blank/", DownloadPDFMobile.as_view()),
]
