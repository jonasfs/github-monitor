import urllib.request
from urllib.error import HTTPError

GITHUB_URL = 'https://api.github.com/repos/'


def repo_exists(name, owner):
    url = '{}{}/{}'.format(GITHUB_URL, owner, name)
    request = urllib.request.Request(url, method="HEAD")
    try:
        response = urllib.request.urlopen(request)
    except HTTPError:
        return False
    return True
