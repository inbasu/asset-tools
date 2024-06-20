from django.test import TestCase

from mars.models import InsightEntity


class TestInsightEntity(TestCase):
    def test_create_entity(self):
        created = InsightEntity.objects.create()
        first = InsightEntity.objects.first()
        self.assertTrue(first)
        self.assertEqual(first, created)

    def test_update_entity(self):
        pass

    def test_create_object(self):
        pass

    def test_search_object(self):
        pass

    def test_update_object(self):
        pass

    def model_permission_denied(self):
        pass
