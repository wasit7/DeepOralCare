from rest_framework import serializers
from .. import models

class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Entity
        fields = '__all__'