from operator import mod
from rest_framework import serializers
from .models import CareTaker, HPJobApplication, EducationType, HealthCareProfessional, StaffMember, SecurityQuestion, SecurityQuestionAnswer, JobPosting, CareTakerRequest


class StaffMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffMember
        fields = ('__all__')

class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationType
        fields = ('id', 'name')

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

class CareTakerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareTakerRequest
        fields = ('__all__')

class CareTakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareTaker
        fields = ('__all__')

class HealthCareProfessionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthCareProfessional
        fields = ('__all__')

class JobPostingSerializer(serializers.ModelSerializer):
    service_type = ServiceTypeSerializer(many=False)
    education_type = EducationTypeSerializer(many=False)
    class Meta:
        model = JobPosting
        fields = ('__all__')

class HPJobApplicationSerializer(serializers.ModelSerializer):
    service_type = ServiceTypeSerializer(many=False)
    education_type = EducationTypeSerializer(many=False)
    job = JobPostingSerializer(many=False)
    class Meta:
        model = HPJobApplication
        fields = ('__all__')
