# Generated by Django 5.1.4 on 2024-12-06 15:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_rename_end_time_session_end_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='description',
            field=models.TextField(default='add description'),
        ),
    ]
