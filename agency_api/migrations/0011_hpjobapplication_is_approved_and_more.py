# Generated by Django 4.0.1 on 2022-02-16 21:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agency_api', '0010_caretakerrequest_is_pending'),
    ]

    operations = [
        migrations.AddField(
            model_name='hpjobapplication',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='hpjobapplication',
            name='is_pending',
            field=models.BooleanField(default=False),
        ),
    ]
