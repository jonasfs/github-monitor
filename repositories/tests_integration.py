from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from repositories.models import (
    Repository,
    Commit
)
from unittest.mock import patch


class CommitTests(APITestCase):
    def setUp(self):
        self.repo = Repository.objects.create(name='test_repo')
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
        results = response.data['results']
        self.assertEqual(len(results), 1)
        commit = results[0]
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
        results = response.data['results']
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(results), 3)

    def test_post_commit(self):
        data = {}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 405)
        commits_count = Commit.objects.all().count()
        self.assertEqual(commits_count, 1)


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
            'name': 'test_repo'
        }

        response = anon_client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 403)
        repo_count = Repository.objects.all().count()
        self.assertEqual(repo_count, 0)

    def test_get_repositories_as_user(self):
        Repository.objects.create(name='test_repo')
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, 200)
        repo_count = Repository.objects.all().count()
        self.assertEqual(repo_count, 1)

    @patch('repositories.github_utils.repo_exists')
    @patch('repositories.github_utils.fetch_commits')
    def test_post_repositories_as_user(
            self, mock_fetch_commits, mock_repo_exists):
        data = {
            'name': 'test_repo'
        }
        mock_repo_exists.return_value = True
        mock_fetch_commits.return_value = [
            {
                'commit': {
                    'message': 'commit msg 1',
                    'author': {
                        'date': timezone.now().isoformat(),
                    },
                },
                'sha': 'abcdef',
                'author': {
                    'login': 'user',
                    'avatar_url': 'http://fakeurl.com/avatar.jpg',
                },
                'html_url': 'http://fakeurl.com/commit/abcdef',
            },
            {
                'commit': {
                    'message': 'commit msg 2',
                    'author': {
                        'date': timezone.now().isoformat(),
                    },
                },
                'sha': 'aaaaa',
                'author': {
                    'login': 'user',
                    'avatar_url': 'http://fakeurl.com/avatar.jpg',
                },
                'html_url': 'http://fakeurl.com/commit/abcdef',
            },
        ]
        response = self.client.post(self.url, data, format='json')
        mock_repo_exists.assert_called()
        self.assertEqual(response.status_code, 201)
        repo_count = Repository.objects.all().count()
        self.assertEqual(repo_count, 1)
        commit_count = Commit.objects.all().count()
        self.assertEqual(commit_count, 2)

    @patch('repositories.github_utils.repo_exists')
    def test_post_with_non_existent_repo(self, mock_repo_exists):
        data = {
            'name': 'test_repo'
        }
        mock_repo_exists.return_value = False
        response = self.client.post(self.url, data, format='json')
        mock_repo_exists.assert_called()
        self.assertEqual(response.status_code, 400)
        repo_count = Repository.objects.all().count()
        self.assertEqual(repo_count, 0)

    @patch('repositories.github_utils.repo_exists')
    @patch('repositories.github_utils.fetch_commits')
    def test_post_repository_with_no_commits(
            self, mock_fetch_commits, mock_repo_exists):
        data = {
            'name': 'test_repo'
        }
        mock_repo_exists.return_value = True
        mock_fetch_commits.return_value = []
        response = self.client.post(self.url, data, format='json')
        mock_repo_exists.assert_called()
        self.assertEqual(response.status_code, 201)
        repo_count = Repository.objects.all().count()
        self.assertEqual(repo_count, 1)
        commit_count = Commit.objects.all().count()
        self.assertEqual(commit_count, 0)

    def test_get_repositories_search(self):
        Repository.objects.create(name='test_repo')
        Repository.objects.create(name='another_repo')

        url = '{}?search=repo'.format(self.url)
        response = self.client.get(url, format='json')
        results = response.data['results']
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(results), 2)

        url = '{}?search=test'.format(self.url)
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        results = response.data['results']
        self.assertEqual(len(results), 1)

        url = '{}?search='.format(self.url)
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        results = response.data['results']
        self.assertEqual(len(results), 2)
