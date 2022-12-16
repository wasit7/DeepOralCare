from .. import models
from . import serializers, utils

def get_entity_response(spo):
    return serializers.EntitySerializer(
            instance=models.Entity.objects.filter(id__in=utils.graph.unique_node_ids(spo=spo)), 
            many=True
        ).data