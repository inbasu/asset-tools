import jwt
import requests
from django.shortcuts import redirect


class IDAMAuthMixin:
    """Main auth mixin must be run first of all mixins"""

    def dispatch(self, request, *args, **kwargs):
        if request.session.get("user", None):
            return super().dispatch(request, *args, **kwargs)
        elif code := request.GET.get("code", None):
            token = IDAM.get_token_with_code(code)
            request.session["user"] = IDAM.form_user_data(token)
            url = request.session.pop("redirect")
            redirect(url)
        else:
            request.session["redirect"] = request.get_full_path()
            redirect(IDAM.code_url)


class IDAM:
    ROLES = {
        "MCC_RU_INSIGHT_IT_ROLE",
        "MCC_RU_INSIGHT_IT_INVENTADMIN_ROLE",
        "MCC_RU_INSIGHT_ACCOUNTANT",
    }

    url = ""
    __client_id = ""
    __client_secret = ""
    data = {}

    @classmethod
    @property
    def code_url(cls, **kwargs) -> str:
        data = {"response_type": "code", **cls.data, **kwargs}
        params = [f"{key}={value}" for key, value in data.items()]
        return f"{cls.url}/authorize/api/oauth2/authorize?{'&'.join(params)}"

    @classmethod
    def get_token_with_code(cls, code, **kwargs):
        url = f"{cls.url}/authorize/api/oauth2/access_token"
        data = {"grant_type": "authoriztion_code", "code": code, **cls.data, **kwargs}
        response = requests.post(
            url=url, auth=requests.auth.HTTPBasicAuth(cls.__client_id, cls.__client_secret), data=data
        )
        if token := response.json().get("access_token"):
            return token

    @classmethod
    def decode_token(cls, token: str) -> dict:
        return jwt.decode(token, algorithms="HS256", options={"verify_signature": False})

    @classmethod
    def form_user_data(cls, token) -> dict:
        data = cls.decode_token(token)
        user = dict(
            username=data["username"],
            email=data["email"],
            roles=[],
            store_role=[],
        )
        for role in data.get("authorization", {}):
            user["roles"].extend(set(role.keys()) & cls.ROLES)

            # get stores from token
            if "MCC_RU_INSIGHT_STORE_ROLE" in role:
                user["store_role"] = cls.get_user_stores(role["MCC_RU_INSIGHT_STORE_ROLE"])
        return user

    @classmethod
    def get_user_stores(cls, stor_role):
        stores = []
        for store in stor_role[0]["store"]:
            if str(store) == "9999":
                stores.append("8001")
            elif len(store) == 3:
                stores.append("1" + store)
            else:
                stores.append("10" + store)
        return stores
