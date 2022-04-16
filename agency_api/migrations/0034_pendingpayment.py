# Generated by Django 4.0.1 on 2022-04-14 02:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agency_api', '0033_alter_payment_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='PendingPayment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=200)),
                ('username', models.CharField(max_length=200)),
                ('hourly_rate', models.DecimalField(decimal_places=2, max_digits=5)),
                ('hours_worked', models.DecimalField(decimal_places=2, max_digits=5)),
                ('amt_paid', models.DecimalField(decimal_places=2, max_digits=12)),
                ('amt_owed', models.DecimalField(decimal_places=2, max_digits=12)),
            ],
            options={
                'db_table': 'agency_api_pendingpayment',
                'managed': False,
            },
        ),
    ]