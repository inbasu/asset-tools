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
            return [
                Property.objects.create(
                    attr_id=attr["id"], name=attr["name"], referenced=attr.get("referencedObjectType", None)
                )
                for attr in fields
            ]
        return []


class PropertyModelManager(models.Manager):
    """redifue create with relatedfield"""

    def create(self, attr_id, name, referenced, *args, **kwargs):
        instance = super().create(attr_id, name, **obj_data)
        if referenced is not None:
            instance.referenced = InsightEntity.objects.get_or_create(
                name=referenced["name"],
                scheme=referenced["objectSchemaId"],
                type_id=referenced["id"],
            )
        instance.save()
        return instance


# Create your models here.
class InsightEntity(models.Model):
    name = models.CharField(max_length=32, null=False, blank=False)
    scheme = models.IntegerField(null=False, blank=False)
    type_id = models.IntegerField(null=False, blank=False, unique=True)
    props = models.ManyToManyField(to="Property")
    # permissions = models.ManyToManyField(to="permission")

    objects = InsightEntityManager()

    def create_object(self, data: dict) -> dict:
        """MARS API create dosn't back arrts-values like others metods"""
        return MARS.create_run(type_id=self.type_id, scheme=self.scheme, attrs=self.encode(data))

    def search_object(self, iql, results=500) -> list[dict]:
        iql = iql + f' AND objectType = "{self.name}"' if iql else f'objectType = "{self.name}"'
        return [
            self.decode(item) for item in MARS.iql_run(iql=iql, scheme=self.scheme, results=results)["objectEntries"]
        ]

    def update_object(self, object_id: int, arrts: dict) -> dict:
        return self.decode(
            MARS.update_run(object_id=object_id, scheme=self.scheme, type_id=self.type_id, attrs=self.encode(arrts))
        )

    def decode(self, item) -> dict:
        result = {}
        for attr in item["attributes"]:
            key = self.props.get(attr_id=attr["objectTypeAttributeId"]).name
            value = None
            for data in attr["objectAttributeValues"]:
                match value:
                    case None:
                        value = data["displayValue"]
                    case list():
                        value.append(data["displayValue"])
                    case _:
                        value = [value, data["displayValue"]]
            result[key] = value
        return result

    def encode(self, attrs: dict) -> dict:
        result = []
        for object_type_attribute_name, object_type_attribute_values in attrs.items():
            attribute_values = []
            if isinstance(object_type_attribute_values, (list, tuple)):
                attribute_values = [{"value": value} for value in object_type_attribute_values]
            elif isinstance(object_type_attribute_values, (int, float, str)):
                attribute_values = [{"value": object_type_attribute_values}]
            if attribute_values:
                result.append(
                    {
                        "objectTypeAttributeId": self.props.get(name=object_type_attribute_name).attr_id,
                        "objectAttributeValues": attribute_values,
                    }
                )
        return result

    # def get_ref_key(self, prop, value) -> str:
    #     result = prop.referenced.search_object(iql=f'"Name" = "{value}"', results=1, include_attributes=False)
    #     if result:
    #         return result[0]["Key"]
    #     return None


class Property(models.Model):
    attr_id = models.IntegerField(null=False, blank=False, unique=True)
    name = models.CharField(max_length=32, null=False, blank=False)
    referenced = models.ForeignKey(to=InsightEntity, on_delete=models.CASCADE, null=True, blank=True)
