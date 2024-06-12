from django.db import models
import subprocess


# Create your models here.
class Printer(models.Model):
    name = models.CharField(max_length=24, unique=True, null=False, blank=False)
    ip = models.CharField(max_length=24, null=False, blank=False)
    mask = models.CharField(max_length=4)
    app = models.CharField(max_length=16)

    def __str__(self) -> str:
        return str(self.name)

    def print(self) -> None:
        pass

    def ping(self) -> bool:
        return True

    def update(self) -> list:
        updated = set()
        for printer in self.printer_from_host():
            printer, _ = self.objects.update_or_create()
            updated.add(printer)
        [printer.delete() for printer in self.objects.all() if printer not in updated]
        return updated

    def printer_from_host(self) -> list[dict]:
        stdout: str = subprocess.run([], capture_output=True).stdout.decode("utf-8", "ignore")
        data = eval(stdout)
        return [self.decode(printer) for printer in data]

    def decode(self, printer_data) -> dict:
        return {}
