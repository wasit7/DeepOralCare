from rest_framework import serializers
from .. import models

class EntitySerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    update_profile = serializers.SerializerMethodField('get_update_profile')

    class Meta:
        model = models.Entity
        fields = [f.name for f in models.Entity._meta.fields] + ['update_profile']

    def get_label(self, obj):
        label_obj = models.Label.objects.get(id=obj.label.id)
        return label_obj.name
    
    def get_update_profile(self, obj):
        return [elm.attribute for elm in models.UpdateEntity.objects.filter(entity=obj.id)]
    
class EntitySearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Entity
        fields = ['id', 'name']

class RelationSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=models.Entity.objects.all()))
    hop = serializers.IntegerField(default=5)