from django.db import models
from .api import utils
# Create your models here.
class Entity(models.Model):
    id = models.CharField(max_length=300, primary_key=True)
    name = models.CharField(max_length=300)
    kind = models.CharField(max_length=15, choices=utils.model_choices.ENTITY_KINDS, default='-')
    attribute = models.JSONField()