from django.db import models
from .api import utils


# Create your models here.

class Label(models.Model):
    name = models.CharField(max_length=500, unique=True)
    attribute = models.JSONField(null=True)
    
    def __str__(self):
        return self.name
    
    
class Entity(models.Model):
    label = models.ForeignKey(Label, on_delete=models.SET_NULL, null=True, blank=True)
    id = models.TextField(primary_key=True)
    name = models.CharField(max_length=300)
    # kind = models.CharField(max_length=15, choices=utils.model_choices.ENTITY_KINDS, default='-')
    attribute = models.JSONField()
    
    def __str__(self):
        return self.name
    
    
class UpdateEntity(models.Model):
    entity = models.CharField(max_length=300)
    attribute =  models.JSONField()