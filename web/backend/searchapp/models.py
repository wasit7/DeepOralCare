from django.db import models

# Create your models here.
class Entity(models.Model):
    id = models.CharField(max_length=300, primary_key=True)
    name = models.CharField(max_length=300)
    attribute = models.JSONField()