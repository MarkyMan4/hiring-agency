# Generated by Django 4.0.2 on 2022-02-20 20:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agency_api', '0010_caretakerrequest_is_pending'),
    ]

    operations = [
        migrations.AddField(
            model_name='hpjobapplication',
            name='first_name',
            field=models.CharField(default=1, max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='hpjobapplication',
            name='last_name',
            field=models.CharField(default=1, max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='hpjobapplication',
            name='gender',
            field=models.CharField(max_length=10),
        ),
    ]
