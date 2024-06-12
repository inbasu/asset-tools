import pytest


@pytest.fixture
def base_url() -> str:
    return ""


# Zebras
def test_print_label(base_url):
    assert True


def test_fail_print(base_url):
    assert True
