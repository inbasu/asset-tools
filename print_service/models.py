import re
from socket import socket, AF_INET, SOCK_STREAM
import subprocess

from django.db import models

HOST = ""
PORT = 9100


# Create your models here.
class Printer(models.Model):
    name = models.CharField(max_length=24, unique=True, null=False, blank=False)
    ip = models.CharField(max_length=24, null=False, blank=False)
    mask = models.CharField(max_length=4)
    app = models.CharField(max_length=16)

    class Meta:
        ordering = ("name",)
        verbose_name = "Printer"

    def __str__(self) -> str:
        return str(self.name)

    def online(self) -> bool:
        """Windos only metod wil fail on *nix"""
        args = ["ping", "-n", "1", self.ip]
        stdout: str = subprocess.run(args, capture_output=True).stdout.decode("cp437", "ignore")
        return not bool("100% loss" in stdout)

    def print(self, label: str) -> None:
        soc = socket(AF_INET, SOCK_STREAM)
        soc.connect((self.ip, PORT))
        soc.send(bytes(label, encoding="utf-8"))
        soc.close()

    """ Update logic """

    @classmethod
    def update(cls) -> list:
        updated = set()
        # here we got logic to get label masks
        masks = {}
        for printer in cls.printers_from_host():
            if app := cls.get_app(printer["name"], masks):
                defaults = {**printer, "app": app, "mask": printer["name"][-4:]}
                printer, _ = cls.objects.update_or_create(
                    name=printer["name"], defaults=defaults, create_defaults=defaults
                )
                updated.add(printer)
        [printer.delete() for printer in cls.objects.all() if printer not in updated]
        return list(updated)

    @classmethod
    def printers_from_host(csl) -> list[dict[str:str]]:
        result: list = []
        args = ["powershel.exe", f"Get-Printers -ComputerName {HOST} | ft name,portname"]
        stdout: str = subprocess.run(args, capture_output=True).stdout.decode("cp437", "ignore")
        # Exaple of stdout sting: "name                    portname(IP) \r\n"
        # Split strings and than split each of them to get listof  tuples [(name, portname(IP))]
        data = [tuple(field for field in printer.split(" ") if field) for printer in stdout.split("\r\n") if printer]
        for fields in data:
            printer_data = Printer.data_to_dict(fields)
            if printer_data is not None:
                result.append(printer_data)
        return result

    @classmethod
    def data_to_dict(cls, fields: tuple[str, str]) -> dict[str:str] | None:
        if len(fields) == 2:
            # with regex check is IP in field[1]
            posible_ip = re.search(r"((25[0-5]|(2[0-4]|1\d[1-9]|)\d)\.?\b){4}", fields[1])
            if posible_ip:
                return {
                    "name": fields[0],
                    "ip": posible_ip.group(0),
                }
        return None

    @classmethod
    def get_app(cls, name: str, masks: dict):
        for mask_prs in masks:
            if mask_prs in name:
                return masks[mask_prs]
