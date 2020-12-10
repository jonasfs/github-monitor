from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from repositories.models import (
    Repository,
    Commit
)


class CommitTests(APITestCase):
    def setUp(self):
        self.repo = Repository.objects.create(name='user/test_repo')
        Commit.objects.create(
            message='commit msg', sha='abcdef', author='user',
            url='http://fakeurl.com/', date=timezone.now(),
            avatar='http://fakeurl.com/avatar.jpg', repository=self.repo)
        self.url = '/api/commits/'
        self.user = User.objects.create_user(
            'user', 'user@user.com', 'user123')
        self.client.force_login(user=self.user)

    def test_get_commits_as_anon(self):
        anon_client = APIClient()
        response = anon_client.get(self.url, format='json')
        self.assertEqual(response.status_code, 403)

    def test_get_commit_as_user(self):
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        commit = response.data[0]
        self.assertEqual(commit['sha'], 'abcdef')

    def test_get_multiple_commits(self):
        Commit.objects.create(
            message='commit msg 2', sha='aaaaa', author='user',
            url='http://fakeurl.com/', date=timezone.now(),
            avatar='http://fakeurl.com/avatar.jpg', repository=self.repo)
        Commit.objects.create(
            message='commit msg 3', sha='bbbbb', author='user',
            url='http://fakeurl.com/', date=timezone.now(),
            avatar='http://fakeurl.com/avatar.jpg', repository=self.repo)
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    def test_post_commit(self):
        data = {}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 405)
        self.assertEqual(len(response.data), 1)


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