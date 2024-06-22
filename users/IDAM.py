from dataclasses import dataclass

import jwt
import requests


@dataclass
class User:
    username: str
    email: str
    roles: list[str]
    store_role: list


class IDAM:
    ROLES = {}

    def __init__(self, url):
        self.url = url
        self.__client_id
        self.__client_secret
        self.data = {}

    def get_user(self):
        pass

    def get_code_url(self, **kwargs) -> str:
        data = {
            "response_type": "code",
            **self.data,
            **kwargs,
        }
        params = [f"{key}={value}" for key, value in data.items()]
        return f"{self.url}/authorize/api/oauth2/authorize?{'&'.join(params)}"

    def get_token_with_code(self):
        url = f"{self.url}/authorize/api/oauth2/access_token"
        data = {}
        response = requests.post(url=url, auth=(), data=data)
        if token := response.json().get("access_token"):
            return token

    def decode_token(self, token: str) -> dict:
        return jwt.decode(token, algorithms="HS256", options={"verify_signature": False})

    def form_user_data(self, token_data) -> User:
        user = User()

        return user
