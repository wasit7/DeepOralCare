from rest_framework import viewsets, mixins, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from . import utils, serializers
from .. import models
class SearchViewset(viewsets.GenericViewSet, 
                    mixins.ListModelMixin,
                    mixins.RetrieveModelMixin):
    
    def get_queryset(self):
        return models.Entity.objects.all()
    
    def get_serializer_class(self):
        return serializers.EntitySerializer
    
    def list(self, request, *args, **kwargs):
        objs = utils.pgsearch.search(word=request.GET.get('q', ""), model=models.Entity, fields=['name'])
        return Response(serializers.EntitySerializer(objs, many=True).data, status=status.HTTP_200_OK)
    

class EntityViewsets(viewsets.GenericViewSet,
                     mixins.ListModelMixin):
    
    def get_queryset(self):
        return models.Entity.objects.all()
    
    def get_serializer_class(self):
        return serializers.EntitySerializer
    
    def list(self, request, *args, **kwargs):
        data = utils.graph.get_spo(name=request.GET.get('name', ""), limit=int(request.GET.get('limit', "100")))
        return Response(data, status=status.HTTP_200_OK)
       