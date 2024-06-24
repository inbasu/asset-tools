from django.urls import path

from utils.views import DownloadMoblieBlank

urlpatterns = [
    path("download/mobile-blank/", DownloadMoblieBlank.as_view()),
]
