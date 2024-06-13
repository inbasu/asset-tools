import subprocess
from api.models import Printer


def test_create_printer():
    assert True


def test_fail_on_creation():
    assert True


def test_ping_printer():
    printer = Printer.objects.first()
    ping_with_method = printer.ping()
    args = ["ping", "", printer.ip]
    ping_with_subprocess = subprocess.run(args, capture_output=True).stdout.decode("utf-8", "ignore")
    assert ping_with_method == ping_with_subprocess


def test_update_printers():
    Printer.update()
    assert True
