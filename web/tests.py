from django.test import TestCase, RequestFactory
from users.IDAM import User

from web.views import IndexView


def request(url):
    request = RequestFactory()
    r = request.get(url)
    r.session = {
        "user": User(
            username="Jane.Doe",
            email="email@domen.com",
            roles=[],
            store_role=[1014],
        )
    }
    return r


# Create your tests here.
class TestUrls(TestCase):
    def test_404_pages(self):
        response = self.client.get("/..")
        self.assertEqual(response.status_code, 404)

    def test_index(self):
        response = IndexView.as_view()(request("/"))
        self.assertEqual(response.status_code, 200)

    # def test_mobile(self):
    #     response = self.client.get("/mobile/")
    #     self.asertEqual(response.status_code, 200)
    #     self.assertTemplateUsed(response, "index.html")

    # def test_pritners_web(self):
    #     response = self.client.get("/printers/")
    #     self.asertEqual(response.status_code, 200)
    #     self.assertTemplateUsed(response, "index.html")

    # def test_it_invent(self):
    #     response = self.client.get("/it-invent/")
    #     self.asertEqual(response.status_code, 200)
    #     self.assertTemplateUsed(response, "index.html")
