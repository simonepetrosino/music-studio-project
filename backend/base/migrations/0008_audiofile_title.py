# Generated by Django 5.1.4 on 2024-12-21 15:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_audiofile_producer_alter_audiofile_artist'),
    ]

    operations = [
        migrations.AddField(
            model_name='audiofile',
            name='title',
            field=models.CharField(default='untitled', max_length=100),
        ),
    ]
