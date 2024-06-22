from django.test import TestCase


# Create your tests here.
class TestUrls(TestCase):
    def test_404_pages(self):
        response = self.client.get("/....")
        self.asertEqual(response.status_code, 404)

    def test_index(self):
        response = self.client.get("/")
        self.asertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "index.html")

    def test_mobile(self):
        response = self.client.get("/mobile/")
        self.asertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "index.html")

    def test_pritners_web(self):
        response = self.client.get("/printers/")
        self.asertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "index.html")

    def test_it_invent(self):
        response = self.client.get("/it-invent/")
        self.asertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "index.html")
