from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import (
    Commit,
    Repository
)
from .serializers import CommitSerializer, RepositorySerializer


class CommitViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Commit.objects.all()
    serializer_class = CommitSerializer
    permission_classes = (IsAuthenticated,)


class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['post']
