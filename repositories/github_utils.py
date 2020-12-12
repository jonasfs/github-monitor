from django.utils import timezone
import datetime
import json
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


def fetch_commits(name, owner):
    date = (timezone.now() - datetime.timedelta(days=30)).isoformat()
    url = '{}{}/{}/commits?since={}'.format(GITHUB_URL, owner, name, date)
    response = urllib.request.urlopen(url)
    if response:
        if response.status == 200:
            data = json.load(response)
            return data
    return None
