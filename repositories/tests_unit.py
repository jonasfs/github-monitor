from django.test import SimpleTestCase
from unittest.mock import patch
from urllib.error import URLError
from . import github_utils
import json


def force_timeout(arg):
    raise URLError('Read timeout')


class MockResponse:
    def __init__(self, json_data, status):
        self.json_data = json_data
        self.status = status

    def read(self):
        return self.json_data


class GithubTests(SimpleTestCase):
    @patch('urllib.request.urlopen')
    def test_repo_exists_successful(self, mock_urlopen):
        mock_urlopen.return_value.status = 200
        exists = github_utils.repo_exists('test_repo', 'user')
        self.assertEqual(exists, True)

    @patch('urllib.request.urlopen')
    def test_repo_not_found(self, mock_urlopen):
        mock_urlopen.return_value.status = 404
        exists = github_utils.repo_exists('test_repo', 'user')
        self.assertEqual(exists, False)

    @patch('urllib.request.urlopen', side_effect=force_timeout)
    def test_repo_exists_timeout(self, mock_urlopen):
        self.assertRaises(
            URLError, github_utils.repo_exists, 'test_repo', 'user')

    @patch('urllib.request.urlopen')
    def test_fetch_commits(self, mock_urlopen):
        test_commits = [{"key1": "value1"}, {"key2": "value2"}]
        response_data = json.dumps(test_commits)
        mock_urlopen.return_value = MockResponse(response_data, 200)
        commits = github_utils.fetch_commits('test_repo', 'user')
        self.assertEqual(len(commits), len(test_commits))

    @patch('urllib.request.urlopen', side_effect=force_timeout)
    def test_fetch_commits_timeout(self, mock_urlopen):
        self.assertRaises(
            URLError, github_utils.fetch_commits, 'test_repo', 'user')

    @patch('urllib.request.urlopen')
    def test_fetch_commits_empty(self, mock_urlopen):
        test_commits = []
        response_data = json.dumps(test_commits)
        mock_urlopen.return_value = MockResponse(response_data, 200)
        commits = github_utils.fetch_commits('test_repo', 'user')
        self.assertEqual(len(commits), len(test_commits))

    @patch('urllib.request.urlopen')
    def test_fetch_commits_not_found(self, mock_urlopen):
        response_data = json.dumps(
            [{'message': 'Not Found'}, {'documentation_url': ''}])
        mock_urlopen.return_value = MockResponse(response_data, 404)
        commits = github_utils.fetch_commits('test_repo', 'user')
        self.assertEqual(commits, None)
