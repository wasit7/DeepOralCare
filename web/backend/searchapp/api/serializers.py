from rest_framework import serializers
from .. import models

class EntitySerializer(serializers.ModelSerializer):
    update_profile = serializers.SerializerMethodField('get_update_profile')
    class Meta:
        model = models.Entity
        fields = [f.name for f in models.Entity._meta.fields] + ['update_profile']

    def get_update_profile(self, obj):
        return [elm.attribute for elm in models.UpdateEnantity.objects.filter(entity=obj.id)]
    
class EntitySearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Entity
        fields = ['id', 'name']

class RelationSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=models.Entity.objects.all()))
    hop = serializers.IntegerField(default=5)