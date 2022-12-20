from rest_framework import serializers
from .. import models

class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Entity
        fields = '__all__'

class EntitySearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Entity
        fields = ['id', 'name']

class RelationSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=models.Entity.objects.all()))
    hop = serializers.IntegerField(default=2)