from django.urls import path

from mars.views.base import CreateRunView, IQLRunView, UpdateRunView

urlpatterns = [
    path("iql/run/", IQLRunView.as_view()),
    path("updat/run/", UpdateRunView.as_view()),
    path("create/run/", CreateRunView.as_view()),
]
