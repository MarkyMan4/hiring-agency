from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import EducationTypeSerializer
from .models import EducationType

class EducationTypeViewSet(viewsets.ModelViewSet):
    serializer_class = EducationTypeSerializer
    queryset = EducationType.objects.all()

    # GET /api/educationtypes/get_education_types
    @action(methods=['GET'], detail=False)
    def get_education_types(self, request):
        education_types = self.queryset
        serializer = self.get_serializer(education_types, many=True)
        
        return Response(serializer.data)
