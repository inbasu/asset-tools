from django.test import TestCase
import random
from mars.models import InsightEntity


class TestInsightEntity(TestCase):
    def test_create_entity(self):
        created = InsightEntity.objects.create(name="PrinterMask", scheme=1, type_id=236)
        first = InsightEntity.objects.first()
        self.assertTrue(first)
        self.assertEqual(first, created)
        self.assertTrue(created.props.all())
        self.assertEqual(list(created.props.all()), list(first.props.all()))

    def test_update_entity(self):
        pass

    def test_create_object(self):
        hw = InsightEntity.objects.create(name="Hardware", scheme=10, type_id=155)
        name = f"test_device #{random.randint(100,1000)}"
        hw.create_object(
            data={
                "Name": name,
                "Type": "INT-381686",  # laptop
                "State": "INT-383219",  # free
                "Model": "INT-382527",  # hp elitbook 820 g3
                "Store": "INT-380820",  # 1014
                "Location": "INT-381031",  # edp storage
            }
        )
        crt_hw = hw.search_object(iql=f'"Name" = "{name}"')
        self.assertTrue(crt_hw)
        self.assertEqual(crt_hw["Name"], name)
        self.assertEqual(crt_hw["Store"], str(1014))

    def test_search_object(self):
        InsightEntity.objects.create(name="PrinterMask", scheme=1, type_id=236)
        objs = InsightEntity.objects.get(name="PrinterMask").search_object(iql='Name="Mask for IT"')
        self.assertTrue(objs)
        self.assertEqual(len(objs), 1)
        self.assertEqual(objs[0]["Mask_App"], "IT")

    def test_update_object(self):
        hw = InsightEntity.objects.create(name="Hardware", scheme=10, type_id=155)
        test_laptop = hw.search_object(iql='"INV No" = 800800')[0]
        new_sn = f"ABCDE{random.randint(100000, 999999)}"
        hw.update_object(object_id=test_laptop["Key"], arrts={"Serial No": new_sn})
        upd_test_laptop = hw.search_object(iql='"INV No" = 800800')[0]
        self.assertNotEqual(test_laptop, upd_test_laptop)
        self.assertEqual(upd_test_laptop["Serial No"], new_sn)

    def model_permission_denied(self):
        pass
