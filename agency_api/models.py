from django.db import models

class EducationType(models.Model):
    name = models.CharField(null=False, max_length=30)
