from django.urls import path

from utils.views import DownloadMoblieBlank, TackebakView

urlpatterns = [
    path("download/mobile-blank/", DownloadMoblieBlank.as_view()),
    path("blank/takeback/", TackebakView.as_view()),
]
