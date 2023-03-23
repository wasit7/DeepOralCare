from django.contrib import admin
from . import models
# Register your models here.

@admin.register(models.Label)
class LabelAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']
    list_filter = ['name']
    

@admin.register(models.Entity)
class EntityAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'label', 'attribute']
    search_fields = ['name']
    list_filter = ['label']


class UpdateEntityAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.UpdateEntity._meta.fields]
admin.site.register(models.UpdateEntity, UpdateEntityAdmin)