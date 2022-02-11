from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from knox.models import AuthToken
from .serializers import EducationTypeSerializer, HPJobApplicationSerializer, JobPostingSerializer, SecurityQuestionSerializer, SecurityQuestionAnswerSerializer
from .models import EducationType, SecurityQuestion, SecurityQuestionAnswer, JobPosting

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
