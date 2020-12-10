from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient


class CommitTests(APITestCase):
    def setUp(self):
        self.url = '/api/commits/'
        self.user = User.objects.create_user(
            'user', 'user@user.com', 'user123')
        self.client.force_login(user=self.user)

    def test_get_commits_as_anon(self):
        anon_client = APIClient()
        response = anon_client.get(self.url, format='json')
        self.assertEqual(response.status_code, 403)

    def test_get_commits_as_user(self):
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, 200)


class RepositoryTests(APITestCase):
    def setUp(self):
        self.url = '/api/repositories/'
        self.user = User.objects.create_user(
            'user', 'user@user.com', 'user123')
        self.client.force_login(user=self.user)

    def test_get_repositories_as_anon(self):
        anon_client = APIClient()
        response = anon_client.get(self.url, format='json')
        self.assertEqual(response.status_code, 403)

    def test_post_repositories_as_anon(self):
        anon_client = APIClient()
        data = {
            'name': 'user/test_repo'
        }
        response = anon_client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 403)

    def test_get_repositories_as_user(self):
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, 405)

    def test_post_repositories_as_user(self):
        data = {
            'name': 'user/test_repo'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)
