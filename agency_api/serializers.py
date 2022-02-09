from rest_framework import serializers
from .models import EducationType, StaffMember, SecurityQuestion, SecurityQuestionAnswer, JobPosting


class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = ('__all__')

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
    question_name = serializers.CharField(source='question.question', required=False)

    class Meta:
        model = SecurityQuestionAnswer
        fields = ('user', 'question', 'question_name', 'answer')
