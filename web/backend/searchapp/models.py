from django.db import models

# Create your models here.
class Entity(models.Model):
    name = models.CharField(max_length=300)
    attribute = models.JSONField()