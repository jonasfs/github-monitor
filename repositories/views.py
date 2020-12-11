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


'''
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def repository_create_view(request):
    serializer = RepositorySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)
'''
