from rest_framework import routers
from . import viewsets

router = routers.DefaultRouter()
router.register('search', viewsets.SearchViewset, basename='search')
router.register('entity', viewsets.EntityViewsets, basename='entity')