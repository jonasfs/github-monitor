from django.test import SimpleTestCase
from unittest.mock import patch
from urllib.error import URLError
from . import github_utils


def force_timeout(arg):
    raise URLError('Read timeout')


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
