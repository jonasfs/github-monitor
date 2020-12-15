from django.utils import timezone
import datetime
import json
import urllib.request

from .models import Commit

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


def add_commits_to_db(repo_instance, api_commits):
    commit_objs = []
    for commit in api_commits:
        author = commit['commit']['author']['email']
        avatar = 'https://picsum.photos/200'
        if 'author' in commit and commit['author'] is not None:
            author = commit['author']['login']
            avatar = commit['author']['avatar_url']

        commit_objs.append(Commit(
            message=commit['commit']['message'],
            sha=commit['sha'],
            author=author,
            url=commit['html_url'],
            date=commit['commit']['author']['date'],
            avatar=avatar,
            repository=repo_instance
        ))

    Commit.objects.bulk_create(commit_objs)
