from rest_framework import serializers
from .models import EducationType, StaffMember, SecurityQuestion, SecurityQuestionAnswer


class StaffMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffMember
        fields = ('__all__')

class EducationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationType
        fields = ('id', 'name')

class SecurityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityQuestion
        fields = ('__all__')

class SecurityQuestionAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityQuestionAnswer
        fields = ('user', 'question', 'answer')
