from rest_framework import viewsets, mixins, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from . import utils, serializers, services
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
        return Response(serializers.EntitySearchSerializer(objs, many=True).data, status=status.HTTP_200_OK)
    

class EntityViewsets(viewsets.GenericViewSet,
                     mixins.ListModelMixin):
    
    def get_queryset(self):
        return models.Entity.objects.all()
    
    def get_serializer_class(self):
        if self.action == "relation":
            return serializers.RelationSerializer
        return serializers.EntitySerializer
    
    def list(self, request, *args, **kwargs):
        spo = utils.graph.get_spo(
            name=request.GET.get('id', ""), 
            page_size=int(request.GET.get('page_size', "100")),
            page=int(request.GET.get('page', "0"))
        )
        response = {
            'relations': spo,
            'entitys': services.get_entity_response(spo=spo)
        }
        return Response(response, status=status.HTTP_200_OK)
    
    @action(methods=['POST'], detail=False)
    def relation(self, request, *args, **kwargs):
        serializer = serializers.RelationSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            spo = utils.graph.get_relation(ids=request.data.get('ids', []), hop=data.get('hop'))
            response = {
                'relations': spo,
                'entitys': services.get_entity_response(spo=spo)
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(methods=['GET'], detail=False)
    def getDetail(self, request, *args, **kwargs):
        entities = models.Entity.objects.filter(id=request.data.get('id',""))
        if entities.exists():
            entity = entities.last()
            return Response(serializers.EntitySerializer(entity).data, status=status.HTTP_200_OK)
        return Response({
            'msg': f"Entity {request.data.get('data','')} does not exixts!"
        }, status=status.HTTP_400_BAD_REQUEST)
    