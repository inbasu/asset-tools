from django.urls import path

from utils.views import SendMailView

urlpatterns = [path("send-mail/", SendMailView.as_view())]
