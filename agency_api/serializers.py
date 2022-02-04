from rest_framework import serializers
from .models import EducationType

class EducationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationType
        fields = ('id', 'name')
