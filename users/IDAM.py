from dataclasses import dataclass

import jwt
import requests
from django.shortcuts import redirect

from mars.models import InsightEntity


@dataclass
class User:
    username: str
    email: str
    roles: list[str]
    store_role: list

    @property
    def insight_key(self) -> str | None:
        """This property often used to redact HWUser
        Not at all idam logic but user logic"""
        try:
            ad_users = InsightEntity.objects.get(name="AD_User").search_object(iql=f'"Email" = {self.email}')
            if len(ad_users) == 1:  # one email == one user
                return ad_users[0]["Key"]
        finally:
            return None


class IDAMMixin:
    """Main auth mixin must be run first of all mixins"""

    def dispatch(self, request):
        if request.session["user"]:
            return super().dispatch(self, request)
        if request.GET.get("code", None):
            token = IDAM.get_token_with_code()
            request.session["user"] = IDAM.form_user_data(token)
            url = request.session.pop("redirect")
            redirect(url)
        request.session["redirect"] = "url"


class IDAM:
    ROLES = {}

    url = ""
    __client_id = ""
    __client_secret = ""
    data = {}

    @classmethod
    def get_code_url(cls, **kwargs) -> str:
        data = {
            "response_type": "code",
            **cls.data,
            **kwargs,
        }
        params = [f"{key}={value}" for key, value in data.items()]
        return f"{cls.url}/authorize/api/oauth2/authorize?{'&'.join(params)}"

    @classmethod
    def get_token_with_code(cls):
        url = f"{cls.url}/authorize/api/oauth2/access_token"
        data = {}
        response = requests.post(url=url, auth=(), data=data)
        if token := response.json().get("access_token"):
            return token

    @classmethod
    def decode_token(cls, token: str) -> dict:
        return jwt.decode(token, algorithms="HS256", options={"verify_signature": False})

    @classmethod
    def form_user_data(cls, token) -> User:
        data = cls.decode_token(token)
        user = User(
            username=data["username"],
            email=data["email"],
            roles=[],
            store_role=[],
        )

        return user
