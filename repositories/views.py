from django_filters import rest_framework as filters
from rest_framework import viewsets, serializers
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from urllib.error import URLError, HTTPError

from .models import (
    Commit,
    Repository
)
from .serializers import CommitSerializer, RepositorySerializer
from . import github_utils


class CommitViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Commit.objects.all()
    serializer_class = CommitSerializer
    pagination_class = LimitOffsetPagination
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = {'author': ['exact'], 'repository__name': ['exact']}


class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer
    pagination_class = LimitOffsetPagination
    permission_classes = (IsAuthenticated,)
    filter_backends = [SearchFilter]
    search_fields = ['name']

    def perform_create(self, serializer):
        data = self.request.data
        if 'name' not in data:
            raise serializers.ValidationError({
                'name': 'No repository name provided'})
        repo = data['name']
        owner = self.request.user
        try:
            commits = github_utils.fetch_commits(repo, owner)
            instance = serializer.save(author=owner)
            github_utils.add_commits_to_db(instance, commits)
        except URLError:
            raise serializers.ValidationError(
                'The url timed out')
        except (HTTPError, AttributeError):
            raise serializers.ValidationError(
                'The GitHub API didn\'t reply properly')

    def get_queryset(self):
        user = self.request.user
        qs = Repository.objects.all().filter(author=user)
        return qs
