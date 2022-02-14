from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from knox.models import AuthToken
from .permissions import CustomModelPermissions
from .serializers import CareTakerRequestSerializer, EducationTypeSerializer, HPJobApplicationSerializer, JobPostingSerializer, SecurityQuestionSerializer, SecurityQuestionAnswerSerializer
from .models import CareTakerRequest, EducationType, SecurityQuestion, SecurityQuestionAnswer, JobPosting
from .validation import is_phone_number_valid, is_email_valid
from datetime import datetime

class JobPostingViewSet(viewsets.ModelViewSet):
    serializer_class = JobPostingSerializer
    queryset = JobPosting.objects.all()
    http_method_names=['get', 'post'] 
    # GET /api/jobposting
    def list(self, request):
        job_postings = self.queryset
        serializer = self.get_serializer(job_postings, many=True)
        return Response(serializer.data)

    # POST /api/jobpostings
    def create(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class EducationTypeViewSet(viewsets.ModelViewSet):
    serializer_class = EducationTypeSerializer
    queryset = EducationType.objects.all()
    http_method_names = ['get'] # only allow GET requests, no one should be able to add more eduction types via API

    # GET /api/educationtypes
    def list(self, request):
        education_types = self.queryset
        serializer = self.get_serializer(education_types, many=True)
        
        return Response(serializer.data)

class SecurityQuestionViewSet(viewsets.ModelViewSet):
    serializer_class = SecurityQuestionSerializer
    queryset = SecurityQuestion.objects.all()
    http_method_names = ['get'] # only allow GET requests, no one should be able to add more eduction types via API

    # GET /api/securityquestions
    def list(self, request):
        security_questions = self.queryset
        serializer = self.get_serializer(security_questions, many=True)
        
        return Response(serializer.data)

class SecurityQuestionAnswerViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SecurityQuestionAnswerSerializer
    http_method_names = ['get', 'post']

    # GET /api/securityquestionanswers
    def list(self, request):
        security_questions = SecurityQuestionAnswer.objects.filter(user_id=self.request.user.id)
        serializer = self.get_serializer(security_questions, many=True)
        
        return Response(serializer.data)

    # POST /api/securityquestionanswers
    def create(self, request):
        data = request.data
        data['user'] = self.request.user.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class HPJobApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = HPJobApplicationSerializer
    http_method_names = ['get', 'post']

class CreateCareTakerRequestViewSet(generics.GenericAPIView):
    serializer_class = CareTakerRequestSerializer

    # POST /api/create_caretaker_request
    def post(self, request):
        data = request.data
        data['date_requested'] = datetime.now()
        data['is_pending'] = True
        data['is_approved'] = False

        # validate email and phone number
        if not is_phone_number_valid(data['phone_number']):
            return Response({'error': 'phone number must be 10 digits and only contain numbers'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not is_email_valid(data['email']):
            return Response({'error': 'invalid email'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CareTakerRequestViewSet(viewsets.ViewSet):
    queryset = CareTakerRequest.objects.filter(is_pending=True)
    permission_classes = [CustomModelPermissions]
    serializer_class = CareTakerRequestSerializer

    # GET /api/caretaker_requests
    def list(self, request):        
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    # POST /api/caretaker_requests/<id>/approve
    # approve a care taker request and create an account for them
    # mark the request as approved and not pending
    @action(methods=['PUT'], detail=True)
    def approve(self, request, pk):
        if not self.queryset.filter(id=pk).exists():
            return Response({'error': 'care taker request does not exist'})

        caretaker_request = self.queryset.get(id=pk)
        caretaker_request.is_approved = True
        caretaker_request.is_pending = False
        caretaker_request.save()
        serializer = self.serializer_class(caretaker_request)

        return Response(serializer.data)
