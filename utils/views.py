# from email.mime.application import MIMEMultipart
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from django.http import FileResponse
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import ItUserPermission, UserPermission

""" Every view can be a mictodervise in future"""


class DownloadMoblieBlankView(APIView):
    http_method_names = ["post"]

    def post(self, request):
        return FileResponse()


class DownloadExcelReportView(APIView):
    http_method_names = ["post"]
    renderer_classes = [ItUserPermission | UserPermission]

    def post(self, request):
        return FileResponse()


class SendMailView(APIView):
    http_method_names = ["post"]
    permission_classes = [ItUserPermission | UserPermission]

    def post(self, request):
        msg = MIMEMultipart()
        msg["Subject"] = request.data.get("subject", "")
        msg["From"] = f"<{request}>"  # request user session user
        msg["Cc"] = request.data.get("copy", "")
        body = MIMEText(request.data.get("body", ""))
        msg.attach(request.data.get(body, ""))
        for file in request.FILES:
            msg.attach(file)
        if msg["To"] is not None:
            with smtplib.SMTP(host="") as connection:
                connection.starttls()
                connection.sendmail(
                    from_addr=msg["From"], to_addrs=msg["To"], msg=msg.as_stri()
                )
            return Response({})
        return Response({})
