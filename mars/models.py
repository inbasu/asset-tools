from django.db import models

from core.settings import mars_connection


# here I use reasingment thst not refactor all methods
MARS = mars_connection


class InsightEntityManager(models.Manager):
    def create(self, **obj_data):
        instance = super().create(**obj_data)
        response = MARS.iql_run(
            iql=f"objectType = {instance.name}", scheme=instance.scheme, include_attributes=True, results=1
        )
        instance.props.set(self.get_entity_props(response))
        instance.save()
        return instance

    def get_entity_props(self, iql_response) -> list:
        if fields := iql_response.get("objectTypeAttributes", {}):
            return [Property.objects.create(attr_id=attr["id"], name=attr["name"]) for attr in fields]
        return []


# Create your models here.
class InsightEntity(models.Model):
    name = models.CharField(max_length=32, null=False, blank=False)
    scheme = models.IntegerField(null=False, blank=False)
    type_id = models.IntegerField(null=False, blank=False)
    props = models.ManyToManyField(to="Property")
    # permissions = models.ManyToManyField(to="permission")

    objects = InsightEntityManager()

    def create_object(self, data: dict) -> dict:
        return self.decode(MARS.create_run(type_id=self.type_id, scheme=self.scheme, attrs=data))

    def search_object(self, iql, results=500) -> list[dict]:
        return [
            self.decode(item) for item in MARS.iql_run(iql=iql, scheme=self.scheme, results=results)["objectEntries"]
        ]

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
    name = models.CharField(max_length=32, null=False, blank=False)
