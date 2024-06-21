import json
import logging

import requests

logger = logging.getLogger()


class Mars:
    def __init__(self, url, username, password, token, client_id) -> None:
        self.URL = url
        self.__username = username
        self.__password = password
        self.__token = token
        self.__client_id = client_id
        self.session = self.create_session()
        self.__update_token()

    def create_session(self) -> requests.Session:
        session = requests.Session()  # here i try to back to session
        session.headers = {
            "Content-Type": "application/json",
            "Authorization": "",
        }
        return session

    def __update_token(self) -> None:
        url = "https://api.metronom.dev/uaa/oauth/token"
        headers = {"Content-Type": "application/x-www-form-urlencode", "Authorization": f"Basic {self.__token}"}
        params = {"grant_type": "password", "username": self.__username, "password": self.__password}
        response = requests.get(url=url, headers=headers, params=params, verify=False, timeout=20)
        if response.status_code == 200:
            self.session.headers["Authorization"] = f'Bearer {response.json()['access_token']}'
            return True
        return False

    def status_code(func) -> callable:
        def wrapper(self, *args, **kwargs) -> dict:
            response = func(self, *args, **kwargs)
            match response.status_code:
                case 200:
                    data = response.json()
                case 500:
                    logger.warning("API METRONOM return status code 500")
                    data = {}
                case 401:
                    self.__update_token()
                    data = func(self, *args, **kwargs).json()
                case _:
                    data = {}
            try:
                return json.loads(data["result"])
            except KeyError:
                return {}

        return wrapper

    """ Insight API 
    I hardcode every method just becoze!"""

    @status_code
    def iql_run(self, iql, scheme, results=1000, deep=1, include_attributes=True):
        url = self.URL + "/iql/run"
        json_data = {
            "iql": iql,
            "client_id": self.__client_id,
            "scheme": scheme,
            "options": {
                "page": 1,  # no need to pagination  just result quantity control
                "resultsPerPage": results,
                "includeAttributes": include_attributes,
                "includeAppributesDeep": deep,
            },
        }
        response = self.session.post(url=url, json=json_data)
        return response

    @status_code
    def update_run(self, object_id, type_id, scheme, attrs):
        url = self.URL + "/update/run"
        json_data = {
            "client_id": self.__client_id,
            "objectId": object_id,
            "scheme": scheme,
            "objectTypeId": type_id,
            "attributes": attrs,
        }
        response = self.session.post(url=url, json=json_data)
        return response

    @status_code
    def create_run(self, type_id: int, scheme: int, attrs: dict):
        url = self.URL + "/create/run"
        json_data = {
            "client_id": self.__client_id,
            "scheme": scheme,
            "objectTypeId": type_id,
            "attributes": attrs,
        }
        response = self.session.post(url=url, json=json_data)
        print(response.status_code)
        print(response.json())
        return response

    def objects_run(self):
        url = self.URl + "/objects/run"
        json_data = {}
        response = self.session.post(url=url, json=json_data)
        return response
