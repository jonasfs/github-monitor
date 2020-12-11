from rest_framework import serializers

from .models import Commit, Repository


class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = ('name',)

    def validate_name(self, value):
        user = self.context['request'].user
        owner_val, repo_val = value.split('/', 1)

        if user.username != owner_val:
            raise serializers.ValidationError(
                'This repository doesn\'t belong to you')
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
