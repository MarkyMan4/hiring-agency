from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import Group
from knox.models import AuthToken
from agency_api.auth.auth_serializers import RegisterUserSerializer, UserSerializer
from .permissions import CustomModelPermissions
from .serializers import CareTakerRequestSerializer, JobPostingSerializerRetrieval, CareTakerSerializer, EducationTypeSerializer, HPJobApplicationSerializer, JobPostingSerializer, RetrieveServiceRequestSerializer, SecurityQuestionSerializer, SecurityQuestionAnswerSerializer, CreateServiceRequestSerializer
from .models import CareTaker, CareTakerRequest, EducationType, SecurityQuestion, SecurityQuestionAnswer, JobPosting, ServiceRequest
from .utils.account import gen_rand_pass
from datetime import datetime

class JobPostingViewSet(viewsets.ModelViewSet):
    serializer_class = JobPostingSerializer
    queryset = JobPosting.objects.all()
    http_method_names=['get', 'post'] 

    # GET /api/jobposting/<id>
    def retrieve(self, request, pk):        
        queryset = self.get_queryset().get(id=pk)
        serializer = JobPostingSerializerRetrieval(queryset, many=False)
        return Response(serializer.data)

    # GET /api/jobposting
    def list(self, request):
        job_postings = self.get_queryset()
        serializer = JobPostingSerializerRetrieval(job_postings, many=True)
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


class CreateHPJobApplicationViewSet(viewsets.ViewSet):
    serializer_class = HPJobApplicationSerializer
    def get_queryset(self):
        return JobPosting.objects.all()

    # POST /api/creataehrjobapplicationviewset
    def create(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class ViewHPJobApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = HPJobApplicationSerializer
    queryset = JobPosting.objects.all()
    http_method_names = ['get']
    # GET /api/viewhrjobapplicationviewset
    def list(self, request):        
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # GET /api/viewhrjobapplicationviewset/<id>
    def retrieve(self, request, pk):        
        queryset = self.get_queryset().get(id=pk)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



class CreateCareTakerRequestViewSet(generics.GenericAPIView):
    serializer_class = CareTakerRequestSerializer

    # POST /api/create_caretaker_request
    def post(self, request):
        data = request.data
        data['date_requested'] = datetime.now()
        data['is_pending'] = True
        data['is_approved'] = False

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CareTakerRequestViewSet(viewsets.ViewSet):
    permission_classes = [CustomModelPermissions]
    serializer_class = CareTakerRequestSerializer

    def get_queryset(self):
        return CareTakerRequest.objects.filter(is_pending=True)

    # GET /api/caretaker_requests
    def list(self, request):
        queryset = self.get_queryset().order_by('date_requested') # order requests oldest to newest
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    # GET /api/caretaker_requests/<id>
    def retrieve(self, request, pk):
        queryset = self.get_queryset().get(id=pk)
        serializer = self.serializer_class(queryset)

        return Response(serializer.data)

    # PUT /api/caretaker_requests/<id>/approve
    # approve a care taker request and create an account for them
    # mark the request as approved and not pending
    @action(methods=['PUT'], detail=True)
    def approve(self, request, pk):
        queryset = self.get_queryset()

        if not queryset.filter(id=pk).exists():
            return Response({'error': 'care taker request does not exist'})

        # update the care taker request
        caretaker_request = queryset.get(id=pk)
        caretaker_request.is_approved = True
        caretaker_request.is_pending = False
        caretaker_request.save()

        # create a care taker account
        username, password = self.register_caretaker(caretaker_request)

        return Response({
            'username': username,
            'password': password
        })

    # PUT /api/caretaker_requests/<id>/reject
    # reject a care taker request mark the request as not approved and not pending
    @action(methods=['PUT'], detail=True)
    def reject(self, request, pk):
        queryset = self.get_queryset()
        
        if not queryset.filter(id=pk).exists():
            return Response({'error': 'care taker request does not exist'})

        # update the care taker request
        caretaker_request = queryset.get(id=pk)
        caretaker_request.is_approved = False
        caretaker_request.is_pending = False
        caretaker_request.save()

        return Response()

    # creates a new care taker and account for them
    # returns a username and password
    def register_caretaker(self, caretaker_request):
        # TODO: The code to create a new user is exactly the same as the code for 
        #       creating a staff member in auth_api. This should be moved to a function
        #       so it can be reused wherever we need to create a user
        generated_password = gen_rand_pass()

        user_data = {
            'first_name': caretaker_request.first_name,
            'last_name': caretaker_request.last_name,
            'username': f"{caretaker_request.last_name}",
            'password': generated_password,
            'email': caretaker_request.email
        }

        # create the user object
        user_serializer = RegisterUserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        # update username to have sequence number
        user.username = user.username + str(user.id).zfill(2)
        user.save()

        # use the user object to create the staff member
        caretaker_data = {
            'user': user.id,
            'address': caretaker_request.address,
            'phone_number': caretaker_request.phone_number,
            'email': caretaker_request.email,
        }

        caretaker_serializer = CareTakerSerializer(data=caretaker_data)
        caretaker_serializer.is_valid(raise_exception=True)
        caretaker_serializer.save()

        # finally, add the user to the staff group
        caretaker_group = Group.objects.get(name='caretaker')
        caretaker_group.user_set.add(user)

        return user.username, generated_password

class CreateServiceRequestViewSet(viewsets.ViewSet):
    serializer_class = CreateServiceRequestSerializer
    permission_classes = [CustomModelPermissions]

    def get_queryset(self):
        return ServiceRequest.objects.all()

    # POST /api/create_service_request
    def create(self, request):
        data = request.data
        user = request.user

        # if user is a care taker, get the care taker ID
        # admin would need to manually provide care taker ID in body
        if not user.is_superuser:
            data['care_taker'] = CareTaker.objects.get(user_id=user.id).id
        else:
            # if an admin makes this request, they need to provide the care takers username
            try:
                data['care_taker'] = CareTaker.objects.get(user__username=data['care_taker_username']).id
            except:
                print('Care taker username not found')

        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RetrieveServiceRequestViewSet(viewsets.ViewSet):
    serializer_class = RetrieveServiceRequestSerializer
    permission_classes = [CustomModelPermissions]

    def get_queryset(self):
        return ServiceRequest.objects.all()

    # GET /api/retrieve_service_requests
    def list(self, request):
        user = request.user

        # if user is a care taker, only get service requests they created
        # for admin or staff, retrieve all service requests
        if user.groups.filter(name='caretaker'):
            queryset = self.get_queryset().filter(care_taker_id=user.id)
        else:
            queryset = self.get_queryset()
        
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    # GET /api/retrieve_service_requests/<id>
    def retrieve(self, request, pk):
        service_request = self.get_queryset().get(id=pk)
        serializer = self.serializer_class(service_request, many=False)

        return Response(serializer.data)
