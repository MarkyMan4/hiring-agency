# Generated by Django 4.0.2 on 2022-03-05 21:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agency_api', '0020_rename_is_active_servicerequest_is_completed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='servicerequest',
            name='patient_gender',
            field=models.CharField(max_length=10),
        ),
    ]
