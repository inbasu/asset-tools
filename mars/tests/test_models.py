from django.test import TestCase

from mars.models import InsightEntity


class TestInsightEntity(TestCase):
    def test_create_entity(self):
        created = InsightEntity.objects.create(name="PrinterMask", scheme=1, type_id=236)
        first = InsightEntity.objects.first()
        self.assertTrue(first)
        self.assertEqual(first, created)
        self.assertTrue(created.props.all())
        self.assertEqual(created.props.all(), first.props.all())

    def test_update_entity(self):
        pass

    def test_create_object(self):
        pass

    def test_search_object(self):
        InsightEntity.objects.create(name="printerMask", scheme=1, type_id=236)
        objs = InsightEntity.objects.get(name="PrinterMask").search_object(iql='Name="Mask for IT"')
        self.assertTrue(objs)
        self.assertEqual(len(objs), 1)
        self.assertEqual(objs[0]["MaskApp"], "IT")

    def test_update_object(self):
        pass

    def model_permission_denied(self):
        pass
