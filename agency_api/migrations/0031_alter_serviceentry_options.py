# Generated by Django 4.0.1 on 2022-04-09 04:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('agency_api', '0030_serviceentry_date_of_service'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='serviceentry',
            options={'ordering': ['-date_of_service', '-start_time']},
        ),
    ]
