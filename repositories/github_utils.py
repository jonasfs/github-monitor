import urllib.request


GITHUB_URL = 'https://api.github.com/repos/'


def repo_exists(name, owner):
    url = '{}{}/{}'.format(GITHUB_URL, owner, name)
    request = urllib.request.Request(url, method="HEAD")
    response = urllib.request.urlopen(request)
    if response:
        if response.status == 200:
            return True
    return False
