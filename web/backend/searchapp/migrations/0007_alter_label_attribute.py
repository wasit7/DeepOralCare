# Generated by Django 4.1.3 on 2023-03-23 17:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('searchapp', '0006_label_remove_entity_kind_alter_entity_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='label',
            name='attribute',
            field=models.JSONField(null=True),
        ),
    ]
