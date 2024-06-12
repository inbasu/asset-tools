import pytest
import requests

"""
Test must when the server is run
"""


@pytest.fixture
def base_url():
    return ""


def test_get_all(base_url):
    response = requests.get(base_url)
    assert response.status_code == 200, f"Wrong status code {response.status_code}"
    data = response.json()
    assert isinstance(data, list), "No list(array) in response"
    assert all("name" in d.keys() for d in data), "No key 'name' in printer data"
    assert all("ip" in d.keys() for d in data), "No key 'ip' in printer data"


def test_get_with_mask(base_url):
    response = requests.get(f"{base_url}?mask=*1014*")
    assert response.status_code == 200, f"Wrong status code {response.status_code}"
    data = response.json()
    assert isinstance(data, list), "No list(array) in response"
    assert all("name" in d.keys() for d in data), "No key 'name' in printer data"
    assert all("ip" in d.keys() for d in data), "No key 'ip' in printer data"
