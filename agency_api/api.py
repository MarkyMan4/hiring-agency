from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from knox.models import AuthToken
from .serializers import EducationTypeSerializer
from .models import EducationType

class EducationTypeViewSet(viewsets.ModelViewSet):
    serializer_class = EducationTypeSerializer
    queryset = EducationType.objects.all()
    http_method_names = ['get'] # only allow GET requests, no one should be able to add more eduction types via API

    # GET /api/educationtypes
    def list(self, request):
        education_types = self.queryset
        serializer = self.get_serializer(education_types, many=True)
        
        return Response(serializer.data)
