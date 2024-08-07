# from email.mime.application import MIMEMultipart
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from django.http import FileResponse
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import ITUserPermission, UserPermission

""" Every view can be a mictodervise in future"""


class DownloadMoblieBlankView(APIView):
    http_method_names = ["post"]

    def post(self, request):
        return FileResponse()


class DownloadExcelReportView(APIView):
    http_method_names = ["post"]
    renderer_classes = [ITUserPermission | UserPermission]

    def post(self, request):
        return FileResponse()


class SendMailView(APIView):
    http_method_names = ["post"]
    permission_classes = [ITUserPermission | UserPermission]

    def post(self, request):
        msg = MIMEMultipart()
        msg["Subject"] = request.data.get("title", "No title")
        msg["From"] = (
            f"{request.session.get('user')['username']} <{request.sessoin.get('user')['email']}>"  # request user session user'
        )
        msg["To"] = request.data.get("to", "").split(";")
        msg["Cc"] = request.data.get("cc", "").split(";")
        body = MIMEText(request.data.get("body", ""))
        msg.attach(request.data.get(body, ""))
        for file in request.FILES:
            msg.attach(file)
        if msg["To"]:
            with smtplib.SMTP(host="") as connection:
                connection.starttls()
                connection.sendmail(
                    from_addr=msg["From"],
                    to_addrs=msg["To"] + msg["From"],
                    msg=msg.as_string(),
                )
            return Response({"ok": "ok"})
        return Response({})
