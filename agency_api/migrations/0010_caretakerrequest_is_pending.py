# Generated by Django 4.0.1 on 2022-02-13 21:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agency_api', '0009_caretakerrequest_first_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='caretakerrequest',
            name='is_pending',
            field=models.BooleanField(default=False),
        ),
    ]
