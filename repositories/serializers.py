from rest_framework import serializers
from urllib.error import URLError, HTTPError

from .models import Commit, Repository
from . import github_utils


class RepositorySerializer(serializers.ModelSerializer):
    commit_count = serializers.SerializerMethodField()

    class Meta:
        model = Repository
        fields = ('name', 'commit_count',)

    def get_commit_count(self, obj):
        return obj.commit_set.count()

    def validate_name(self, value):
        user = self.context['request'].user

        try:
            repo_exists = github_utils.repo_exists(value, user)
            if not repo_exists:
                raise serializers.ValidationError(
                    'This repository doesn\'t exist')
        except URLError:
            raise serializers.ValidationError(
                'The url timed out')
        except (HTTPError, AttributeError):
            raise serializers.ValidationError(
                'The GitHub API didn\'t reply properly')
        return value
    

class CommitSerializer(serializers.ModelSerializer):
    repository = serializers.StringRelatedField(many=False)

    class Meta:
        model = Commit
        fields = (
            'message',
            'sha',
            'author',
            'url',
            'avatar',
            'date',
            'repository',
        )
