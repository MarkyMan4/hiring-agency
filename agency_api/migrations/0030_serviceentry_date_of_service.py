# Generated by Django 4.0.1 on 2022-04-09 04:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agency_api', '0029_remove_billingaccount_amt_to_be_paid_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='serviceentry',
            name='date_of_service',
            field=models.DateField(default='2022-04-04'),
            preserve_default=False,
        ),
    ]