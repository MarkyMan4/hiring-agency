from rest_framework import serializers

from agency_api.auth.auth_serializers import UserSerializer
from .models import (
    BillingAccount,
    CareTaker, 
    HPJobApplication, 
    HealthCareProfessional, 
    EducationType,
    ServiceEntry, 
    ServiceType, 
    StaffMember, 
    SecurityQuestion, 
    SecurityQuestionAnswer, 
    JobPosting, 
    CareTakerRequest, 
    ServiceRequest,
    ServiceAssignment,
    TimeSlot,
    AccountStatus
)

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

class ViewStaffMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    class Meta:
        model = StaffMember
        fields = ('__all__')

class ViewCareTakerMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    class Meta:
        model = CareTaker
        fields = ('__all__')

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

class HealthCareProfessionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthCareProfessional
        fields = ('__all__')

class HealthCareProfessionalDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)

    class Meta:
        model = HealthCareProfessional
        fields = ('__all__')

# basic service assignment serializer, foreign keys are just IDs
class ServiceAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceAssignment
        fields = ('__all__')

# detail view where foreign keys are serialized and all data is provided
class ServiceAssignmentDetailSerializer(serializers.ModelSerializer):
    healthcare_professional = HealthCareProfessionalDetailSerializer(many=False)
    service_request = RetrieveServiceRequestSerializer(many=False)

    class Meta:
        model = ServiceAssignment
        fields = ('__all__')

class JobPostingRetrieveSerializer(serializers.ModelSerializer):
    service_type = ServiceTypeSerializer(many=False)
    education_type = EducationTypeSerializer(many=False)
    class Meta:
        model = JobPosting
        fields = ('__all__')

class HPJobApplicationRetrieveSerializer(serializers.ModelSerializer):
    service_type = ServiceTypeSerializer(many=False)
    education_type = EducationTypeSerializer(many=False)
    job = JobPostingRetrieveSerializer(many=False)
    class Meta:
        fields = ('__all__')
        model = HPJobApplication

class BillingAccountDetailSerializer(serializers.ModelSerializer):
    service_request = RetrieveServiceRequestSerializer(many=False)

    class Meta:
        fields = ('__all__')
        model = BillingAccount


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ('__all__')

class ServiceEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceEntry
        fields = ('__all__')

class ServiceEntryDetailSerializer(serializers.ModelSerializer):
    billing_account = BillingAccountDetailSerializer(many=False)
    healthcare_professional = HealthCareProfessionalDetailSerializer(many=False)

    class Meta:
        model = ServiceEntry
        fields = ('__all__')

class UnlockUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    class Meta:
        model = AccountStatus
        fields = ('__all__')