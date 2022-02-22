from pickle import FALSE
from rest_framework import serializers

from agency_api.auth.auth_serializers import UserSerializer
from .models import CareTaker, HPJobApplication, EducationType, ServiceType, StaffMember, SecurityQuestion, SecurityQuestionAnswer, JobPosting, CareTakerRequest, ServiceRequest

class HPJobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HPJobApplication
        fields = ('__all__')

class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ('__all__')

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
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

# used for creating care takers
class CareTakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareTaker
        fields = ('__all__')

# used when user info is needed when getting care taker info (first name, last name, etc.)
class CareTakerDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)

    class Meta:
        model = CareTaker
        fields = ('__all__')

class CreateServiceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = ('__all__')

class RetrieveServiceRequestSerializer(serializers.ModelSerializer):
    care_taker = CareTakerDetailSerializer(many=False)
    service_type = ServiceTypeSerializer(many=False)

    class Meta:
        model = ServiceRequest
        fields = ('__all__')
