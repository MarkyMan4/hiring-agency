from pickle import FALSE
from rest_framework import serializers
from .models import CareTaker, HPJobApplication, EducationType, ServiceType, StaffMember, SecurityQuestion, SecurityQuestionAnswer, JobPosting, CareTakerRequest

class HPJobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HPJobApplication
        fields = ('__all__')

class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ('name',)

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        #fields = ("service_type" , "id", "years_experience_required")
        fields = ('__all__')
        


class EducationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationType
        fields = ('__all__')
      

class JobPostingSerializerRetrieval(serializers.ModelSerializer):
    service_type = ServiceTypeSerializer(many=False)
    education_type = EducationTypeSerializer(many=False)
    class Meta:
        model = JobPosting
        fields = ("service_type" ,"education_type", "id", "years_experience_required", "description")
        

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

class CareTakerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareTakerRequest
        fields = ('__all__')

class CareTakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareTaker
        fields = ('__all__')
