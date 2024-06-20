import os
import socket
import unittest
from django.test import TestCase

from print_service.models import Printer
from mars.models import InsightEntity
# TODO:
# [*]define socket listener for print test


# Create your tests here.
class PrinterModelTest(TestCase):
    """I'll create 127.0.0.1 printer for ping and print tests"""

    @classmethod
    def setUpClass(cls) -> None:
        InsightEntity.objects.create(name="PrinterMask", scheme=1, type_id=236)
        Printer.objects.create(name="PrinterName", ip="127.0.0.1", app="IT", mask="mask")
        Printer.objects.create(name="PrinterWithBadIP", ip="266.0.0.1", app="Fail", mask="Bad")
        cls.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        cls.s.bind(("127.0.0.1", 9100))
        cls.s.listen(1)

    def test_create_printer(self) -> None:
        self.assertTrue(Printer.objects.get(name="PrinterName"))

    @unittest.skipIf(os.name != "nt", "Not windows")
    def test_printer_online(self) -> None:
        self.assertTrue(Printer.objects.first().online())
        self.assertFalse(Printer.objects.get(name="PrinterWithBadIP").online())

    def test_send_to_print(self) -> None:
        msg = "Hello world!"
        Printer.objects.first().print("Hello world!")
        con, adr = PrinterModelTest.s.accept()
        data = con.recv(1024)
        self.assertEqual(msg, str(data, encoding="utf-8"))

    def test_update_printers(self) -> None:
        result = Printer.update()
        self.assertTrue(result)
        self.assertTrue(isinstance(result, list))
        self.assertFalse("PrinterName" in [printer.name for printer in result])
        self.assertTrue(all([printer.name for printer in result]))
        self.assertTrue(all([printer.ip for printer in result]))

    @classmethod
    def tearDownClass(cls) -> None:
        cls.s.close()
