from django.db import models

from mars.backend.mars import MARS


class InsightEntityManager(models.Manager):
    pass


# Create your models here.
class InsightEntity(models.Model):
    name = models.CharField(max_length=32, null=False, blank=False)
    scheme = models.IntegerField(null=False, blank=False)
    type_id = models.IntegerField(null=False, blank=False)
    props = models.ManyToManyField(to="Property", on_delete=models.CASCADE)
    # permissions = models.ManyToManyField(to="permission")

    def create_object(self, data: dict) -> dict:
        return self.decode(MARS.create_run(type_id=self.type_id, scheme=self.scheme, attrs=data))

    def search_object(self, iql, results) -> list[dict]:
        return self.decode(MARS.iql_run(iql=iql, scheme=self.scheme, results=results))

    def update_object(self, dict) -> dict:
        return self.decode(MARS.update_run())

    def decode(self, item) -> dict:
        result = {}
        for attr in item["attributes"]:
            key = self.props.objects.get(attr["objectAttributeId"])
            value = None
            for data in attr["objectAttributeValues"]:
                match field := data["displayValue"]:
                    case None:
                        value = field
                    case list():
                        value.append(field)
                    case _:
                        value = [value, field]
            result[key] = value
        return result

    def encode(self, item) -> dict:
        pass


class Property(models.Model):
    """attr_id isn't unique coz in different scemas it can be reused"""

    attr_id = models.IntegerField(null=False, blank=False)
    field = models.CharField(max_length=32, null=False, blank=False)
