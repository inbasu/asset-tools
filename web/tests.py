from django.test import TestCase
from django.conf import settings


# Create your tests here.
class TestUrls(TestCase):
    def setUp(self):
        # configure session
        session = self.client.session
        session["user"] = dict(
            username="Jane.Doe",
            email="email@domen.com",
            roles=["MCC_RU_INSIGHT_IT_ROLE"],
            store_role=[1014],
        )
        session.save()
        self.client.cookies[settings.SESSION_COOKIE_NAME] = session.session_key

    # def test_404_pages(self):
    #     response = self.client.get("/....")
    #     self.assertEqual(response.status_code, 404)

    def test_index(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "index.html")

    # def test_mobile(self):
    #     response = self.client.get("/mobile/")
    #     self.assertEqual(response.status_code, 200)
    #     self.assertTemplateUsed(response, "index.html")

    # def test_pritners_web(self):
    #     response = self.client.get("/printers/")
    #     self.assertEqual(response.status_code, 200)
    #     self.assertTemplateUsed(response, "index.html")

    def test_it_invent(self):
        response = self.client.get("/it-invent/")
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "index.html")
