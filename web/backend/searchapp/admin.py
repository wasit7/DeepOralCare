from django.contrib import admin
from . import models
# Register your models here.

@admin.register(models.Label)
class LabelAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']
    list_filter = ['name']
    

class EntityAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.Entity._meta.fields]
    search_fields = ['name']
admin.site.register(models.Entity, EntityAdmin)

class UpdateEntityAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.UpdateEntity._meta.fields]
admin.site.register(models.UpdateEntity, UpdateEntityAdmin)