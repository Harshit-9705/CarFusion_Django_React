# Generated by Django 5.1 on 2024-09-23 15:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_transaction'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transaction',
            old_name='amount',
            new_name='price',
        ),
    ]
