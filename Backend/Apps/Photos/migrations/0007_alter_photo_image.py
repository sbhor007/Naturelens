# Generated by Django 5.2.1 on 2025-06-11 04:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Photos', '0006_rename_category_id_photo_category_alter_photo_table'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photo',
            name='image',
            field=models.FileField(upload_to='mediafiles'),
        ),
    ]
