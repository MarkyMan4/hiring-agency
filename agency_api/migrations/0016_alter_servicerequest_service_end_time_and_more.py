# Generated by Django 4.0.1 on 2022-02-21 17:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agency_api', '0015_alter_caretaker_email_alter_caretaker_phone_number_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='servicerequest',
            name='service_end_time',
            field=models.TimeField(null=True),
        ),
        migrations.AlterField(
            model_name='servicerequest',
            name='service_start_time',
            field=models.TimeField(null=True),
        ),
    ]