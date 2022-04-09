from urllib import request
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Min
from django.contrib.auth.models import Group
from agency_api.auth.auth_serializers import RegisterUserSerializer, UserSerializer
from .permissions import CustomModelPermissions
from .serializers import (
    BillingAccountDetailSerializer,
    CareTakerRequestSerializer,
    HPJobApplicationRetrieveSerializer, 
    JobPostingSerializerRetrieval, 
    HealthCareProfessionalSerializer, 
    HealthCareProfessionalDetailSerializer,
    CareTakerSerializer,
    EducationTypeSerializer,
    HPJobApplicationSerializer,
    JobPostingSerializer,
    RetrieveServiceRequestSerializer,
    SecurityQuestionSerializer,
    SecurityQuestionAnswerSerializer,
    ServiceEntryDetailSerializer,
    ServiceEntrySerializer,
    ServiceTypeSerializer,
    TimeSlotSerializer,
    ViewStaffMemberSerializer,
    ViewCareTakerMemberSerializer,
    CreateServiceRequestSerializer,
    ServiceAssignmentDetailSerializer,
    ServiceAssignmentSerializer
)
from .models import (
    BillingAccount,
    CareTaker, 
    CareTakerRequest,
    HPJobApplication, 
    EducationType,
    HealthCareProfessional, 
    SecurityQuestion, 
    SecurityQuestionAnswer, 
    JobPosting,
    ServiceEntry,
    ServiceType, 
    StaffMember,
    CareTaker,
    ServiceRequest, 
    ServiceAssignment,
    TimeSlot,
    User
)
from .utils.account import gen_rand_pass
from .utils.utils import time_diff
import datetime
from dateutil.relativedelta import relativedelta
from datetime import timedelta
from .utils.templates import email_template
from django.core.mail import send_mail
from django.conf import settings


# given a service request, calculate the end date
def get_service_end_date(serv_req: ServiceRequest):
    days_service_needed = {
        0: serv_req.service_needed_monday,
        1: serv_req.service_needed_tuesday,
        2: serv_req.service_needed_wednesday,
        3: serv_req.service_needed_thursday,
        4: serv_req.service_needed_friday,
        5: serv_req.service_needed_saturday,
        6: serv_req.service_needed_sunday
    }

    days_of_service = serv_req.days_of_service
    date = serv_req.start_date

    # add 1 to start date for each day of service needed
    while days_of_service > 0:
        if days_service_needed[date.weekday()]:
            days_of_service -= 1

        if days_of_service > 0:
            date += timedelta(days=1)

    return date

class ServiceTypeViewSet(viewsets.ViewSet):
    serializer_class = ServiceTypeSerializer

    def get_queryset(self):
        return ServiceType.objects.all()

    # GET /api/service_types
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    def retrieve(self, request, pk):
        queryset = self.get_queryset().get(id=pk)
        serializer = self.serializer_class(queryset)

        return Response(serializer.data)

    # POST /api/creataehrjobapplicationviewset
    def create(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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

        count = SecurityQuestionAnswer.objects.filter(user_id=self.request.user.id).count()
        while count > 3:
            old_question = SecurityQuestionAnswer.objects.filter(user_id=request.user.id).order_by('id').first()
            old_question.delete()
            count = SecurityQuestionAnswer.objects.filter(user_id=self.request.user.id).count()

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
        data['date_requested'] = datetime.datetime.now()
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
        username, email = self.register_caretaker(caretaker_request)

        return Response({
            'username': username,
            'email': email
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

        # add the user to the staff group
        caretaker_group = Group.objects.get(name='caretaker')
        caretaker_group.user_set.add(user)

        # send an email with the first time login credentials
        send_mail(
            'New care taker account',
            email_template.format(username=user.username, password=generated_password),
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )

        return user.username, user.email

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
                return Response({'error': 'Care taker username not found'}, status=status.HTTP_400_BAD_REQUEST)

        # create a copy of the data, get all the data types right, then load into a ServiceRequest object
        serv_req_data = data.copy()
        serv_req_data['care_taker'] = CareTaker.objects.get(id=serv_req_data['care_taker'])
        serv_req_data['service_type'] = ServiceType.objects.get(id=serv_req_data['service_type'])
        serv_req_data['start_date'] = datetime.datetime.strptime(serv_req_data['start_date'], '%Y-%m-%d').date()
        serv_req_data['days_of_service'] = int(serv_req_data['days_of_service'])
        
        if serv_req_data['flexible_hours']:
            serv_req_data['hours_of_service_daily'] = int(serv_req_data['hours_of_service_daily'])
        else:
            start_hour = int(serv_req_data['service_start_time'].split(':')[0])
            start_minute = int(serv_req_data['service_start_time'].split(':')[1])
            serv_req_data['service_start_time'] = datetime.time(start_hour, start_minute)

            end_hour = int(serv_req_data['service_end_time'].split(':')[0])
            end_minute = int(serv_req_data['service_end_time'].split(':')[1])
            serv_req_data['service_end_time'] = datetime.time(end_hour, end_minute)

        new_serv_req = ServiceRequest(**serv_req_data)

        if self.is_request_time_available(new_serv_req):
            serializer = self.serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            # create a billing account
            BillingAccount.objects.create(
                service_request=ServiceRequest.objects.get(id=serializer.data['id']),
                amt_paid=0.00
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'this overlaps with an existing service request'}, status=status.HTTP_400_BAD_REQUEST)

    def is_request_time_available(self, serv_req: ServiceRequest):
        # get existing requests for this patient and check if any times overlap
        existing_reqs = ServiceRequest.objects.filter(
            care_taker_id=serv_req.care_taker,
            patient_first_name=serv_req.patient_first_name,
            patient_last_name=serv_req.patient_last_name,
            patient_gender=serv_req.patient_gender,
            patient_date_of_birth=serv_req.patient_date_of_birth,
            patient_phone_number=serv_req.patient_phone_number,
            patient_email=serv_req.patient_email
        )

        new_req_start_date = serv_req.start_date
        new_req_end_date = get_service_end_date(serv_req)

        # check if new request date overlaps with the dates of an existing request
        # if the dates overlap, check for overlap of times in the requests
        for req in existing_reqs:
            start_date = req.start_date
            end_date = get_service_end_date(req)

            is_start_date_overlapping = new_req_start_date <= end_date and new_req_start_date >= start_date
            is_end_date_overlapping = new_req_end_date >= start_date and new_req_end_date <= end_date

            # if dates overlap, check if times overlap
            if is_start_date_overlapping or is_end_date_overlapping:
                if self.reqs_have_time_overlap(serv_req, req):
                    return False

        return True

    def reqs_have_time_overlap(self, serv_req1: ServiceRequest, serv_req2: ServiceRequest):
        # if both requests have set hours, make sure they don't overlap
        # if one or both requests have flexible hours, make sure the total hours doesn't exceed 24
        # TODO: for flexible hours, comparing two requests at a time isn't enough. We'd have to look
        #       at all service requests to make sure the total hours is under 24
        days_overlap = [
            serv_req1.service_needed_sunday and serv_req2.service_needed_sunday,
            serv_req1.service_needed_monday and serv_req2.service_needed_monday,
            serv_req1.service_needed_tuesday and serv_req2.service_needed_tuesday,
            serv_req1.service_needed_wednesday and serv_req2.service_needed_wednesday,
            serv_req1.service_needed_thursday and serv_req2.service_needed_thursday,
            serv_req1.service_needed_friday and serv_req2.service_needed_friday,
            serv_req1.service_needed_saturday and serv_req2.service_needed_saturday
        ]

        # if no days in the requests overlap, no need to check times
        if not any(days_overlap):
            return False

        # check if times overlap
        if not serv_req1.flexible_hours and not serv_req2.flexible_hours:
            start_times_overlap = (
                serv_req1.service_start_time >= serv_req2.service_start_time and 
                serv_req1.service_start_time < serv_req2.service_end_time
            )

            end_times_overlap = (
                serv_req1.service_end_time > serv_req2.service_start_time and 
                serv_req1.service_end_time <= serv_req2.service_end_time
            )

            # check if new service request starts before and ends after an existing request
            all_times_overlap = (
                (serv_req1.service_start_time <= serv_req2.service_start_time and
                    serv_req1.service_start_time >= serv_req2.service_end_time)
                or
                (serv_req2.service_start_time <= serv_req1.service_start_time and
                    serv_req2.service_start_time >= serv_req1.service_end_time)
            )

            if start_times_overlap or end_times_overlap or all_times_overlap:
                return True
        else: # at least one request has flexible hours, so make sure the total hours don't exceed 24
            serv_req1_hours_per_day = self.get_hours_of_service_per_day(serv_req1)
            serv_req2_hours_per_day = self.get_hours_of_service_per_day(serv_req2)

            if serv_req1_hours_per_day + serv_req2_hours_per_day > 24:
                return True

        return False

    def get_hours_of_service_per_day(self, serv_req: ServiceRequest):
        # calculate the hours of service per day
        # if flexible hours, this is a field in the model
        # if not flexible hours, take the difference of start/end time and give the result in hours
        hours_per_day = 0

        if serv_req.flexible_hours:
            hours_per_day = serv_req.hours_of_service_daily
        else:
            hours_per_day = time_diff(serv_req.service_start_time, serv_req.service_end_time)

        return hours_per_day

class RetrieveServiceRequestViewSet(viewsets.ViewSet):
    serializer_class = RetrieveServiceRequestSerializer
    permission_classes = [CustomModelPermissions]

    def get_queryset(self):
        return ServiceRequest.objects.all()
  
    # GET /api/retrieve_service_requests/<id>/get_assign_by_request
    @action(methods=['GET'], detail=True)
    def get_assign_by_request(self, request, pk):
        queryset = ServiceAssignment.objects.filter(service_request_id=pk)
        serializer = ServiceAssignmentDetailSerializer(queryset, many=True)

        return Response(serializer.data) 

    # GET /api/retrieve_service_requests
    def list(self, request):
        user = request.user
        
        # if user is a care taker, only get service requests they created
        # for healthcare pro, only get service requests they are assigned to
        # for admin or staff, retrieve all service requests
        if user.groups.filter(name='caretaker'):
            queryset = self.get_queryset().filter(care_taker_id__user_id=user.id)  #__ means to join and then filter whatever after
        elif user.groups.filter(name='healthcareprofessional'):
            hp_id = HealthCareProfessional.objects.get(user_id=user.id)
            assignments = ServiceAssignment.objects.filter(healthcare_professional=hp_id).values_list('service_request_id', flat=True)
            queryset = self.get_queryset().filter(id__in=assignments)
        else:
            queryset = self.get_queryset()

        # filter based on any query params that were provided
        if request.query_params.get('is_assigned'):
            value = request.query_params.get('is_assigned')
            queryset = queryset.filter(is_assigned=True if value.lower() == 'true' else False)
        
        if request.query_params.get('is_completed'):
            value = request.query_params.get('is_completed')
            queryset = queryset.filter(is_completed=True if value.lower() == 'true' else False)
        
        serializer = self.serializer_class(queryset, many=True)
        
        return Response(serializer.data)

    # GET /api/retrieve_service_requests/<id>
    def retrieve(self, request, pk):
        service_request = self.get_queryset().get(id=pk)
        serializer = self.serializer_class(service_request, many=False)

        return Response(serializer.data)

    # [
    #     "Monday",
    #     "John Doe",
    #     Date.parse('1-1-1 08:00'),
    #     Date.parse('1-1-1 12:30'),
    # ],

    # GET /api/retrieve_service_requests/<id>/assigned_times
    @action(methods=['GET'], detail=True)
    def assigned_times(self, request, pk):
        times = TimeSlot.objects.filter(service_assignment__service_request_id=pk).order_by('day')

        day_map = {
            0: 'Sunday',
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday'
        }

        assignments = []

        for time in times:
            first_name = time.service_assignment.healthcare_professional.user.first_name
            last_name = time.service_assignment.healthcare_professional.user.last_name
            name = first_name + ' ' + last_name

            assignments.append(
                {
                    'day': day_map[time.day],
                    'name': name,
                    'start_time': time.start_time,
                    'end_time': time.end_time
                }
            )

        return Response(assignments)        

# only used for creating service assignments since this requires a different serializer
# i.e. only need IDs of healthcare pro and service request when creating this assignment
class CreateServiceAssignmentViewSet(viewsets.ViewSet):
    serializer_class = ServiceAssignmentSerializer
    permission_classes = [CustomModelPermissions]

    # still need a queryset defined for permissions
    def get_queryset(self):
        return ServiceAssignment.objects.all()

    # POST /api/create_service_assignment
    def create(self, request):
        data = request.data

        # only create the assignment if this combination of HP and service request doesn't exist
        if ServiceAssignment.objects.filter(healthcare_professional_id=data['healthcare_professional'], service_request_id=data['service_request']).count() == 0:
            serializer = self.serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        serv_assign = ServiceAssignment.objects.get(
            healthcare_professional_id=data['healthcare_professional'], 
            service_request_id=data['service_request']
        )
        service_assignment_id = serv_assign.id

        # create the time slots that were specified
        for ts in data['time_slots']:
            ts_data = ts
            ts_data.update({'service_assignment': service_assignment_id})

            ts_serializer = TimeSlotSerializer(data=ts_data)
            ts_serializer.is_valid(raise_exception=True)
            ts_serializer.save()

        # update the service request to assigned
        service_request = ServiceRequest.objects.get(id=data.get('service_request'))
        service_request.is_assigned = True
        service_request.save()

        return Response({'result': 'assignment successful'}, status=status.HTTP_201_CREATED)


# used for any operations around a service request except for creation
class ServiceAssignmentViewSet(viewsets.ViewSet):
    serializer_class = ServiceAssignmentDetailSerializer
    permission_classes = [CustomModelPermissions]

    def get_queryset(self):
        return ServiceAssignment.objects.all()


    # GET /api/service_assignments
    def list(self, request):
        data = self.get_queryset()
        serializer = self.serializer_class(data, many=True)

        return Response(serializer.data)

    # GET /api/service_assignments/<id>
    def retrieve(self, request, pk):
        queryset = self.get_queryset().get(id=pk)
        serializer = self.serializer_class(queryset)

        return Response(serializer.data) 

    # DELETE /api/service_assignments/<id>
    def destroy(self, request, pk):
        serv_assign = self.get_queryset().get(id=pk)
        serv_req_id = serv_assign.service_request.id
        serv_assign.delete()

        # if there are no more service assignments referencing the request, mark the request as unassigned
        if ServiceAssignment.objects.filter(service_request_id=serv_req_id).count() == 0:
            service_request = ServiceRequest.objects.get(id=serv_req_id)
            service_request.is_assigned = False
            service_request.save()

        return Response() 


class HPJobApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [CustomModelPermissions]
    serializer_class = HPJobApplicationRetrieveSerializer

    def get_queryset(self):
        return HPJobApplication.objects.filter(is_pending=True)

    # GET /api/job_advertisement_request
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    # GET /api/job_advertisement_request/<id>
    def retrieve(self, request, pk):
        queryset = self.get_queryset().get(id=pk)
        serializer = self.serializer_class(queryset)

        return Response(serializer.data)        

    @action(methods=['POST'], detail=True)
    def approve(self, request, pk):
        queryset = self.get_queryset()

        if not queryset.filter(id=pk).exists():
            return Response({'error':'advertisement request is not exist'})
        #Do the approve opreation
        job_request = queryset.get(id=pk)
        job_request.is_approved = True
        job_request.is_pending = False
        job_request.save()

        username, email = self.register_hp(job_request, request.data['salary'])
        return Response({
            'username' :username ,
            'email' :email
        })

    @action(methods=['PUT'], detail=True)
    def reject(self, request, pk):
        queryset = self.get_queryset()
        if not queryset.filter(id=pk).exists():
            return Response({'error':'advertisement request is not exist'})

        job_request = queryset.get(id=pk)
        job_request.is_approved = False
        job_request.is_pending = False
        job_request.save()

        return Response()

    def register_hp(self, job_request, salary):
        generated_password = gen_rand_pass()

        user_data = {
            'first_name': job_request.first_name,
            'last_name': job_request.last_name,
            'username': f"{job_request.last_name}",
            'password': generated_password,
            'email': job_request.email
        }

        # create the user object
        user_serializer = RegisterUserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        # update username to have sequence number
        user.username = user.username + str(user.id).zfill(2)
        user.save()

        hp_data ={
            'user':user.id,
            'gender': job_request.gender,
            'date_of_birth':job_request.date_of_birth,
            'ssn':job_request.ssn,
            'service_type':job_request.service_type.id,
            'education_type':job_request.education_type.id,
            'education_institution':job_request.education_institution,
            'graduation_year':job_request.graduation_year,
            'graduation_month':job_request.graduation_month,
            'years_of_experience':job_request.years_of_experience,
            'address':job_request.address,
            'phone_number':job_request.phone_number,
            'email':job_request.email,
            'hourly_rate':salary
        }

        HCP_serializer = HealthCareProfessionalSerializer(data=hp_data)
        HCP_serializer.is_valid(raise_exception=True)
        HCP_serializer.save()

        heathCareProfessional_group = Group.objects.get(name='healthcareprofessional')
        heathCareProfessional_group.user_set.add(user)

        # send an email with the first time login credentials
        send_mail(
            'New healthcare professional account',
            email_template.format(username=user.username, password=generated_password),
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )

        return user.username, user.email


class HPViewSet(viewsets.ModelViewSet):
    serializer_class = HealthCareProfessionalDetailSerializer

    def get_queryset(self):
        return HealthCareProfessional.objects.all()

    # GET /api/hp_requests/<id>
    def retrieve(self, request, pk):
        queryset = self.get_queryset().get(id=pk)
        serializer = self.serializer_class(queryset)

        return Response(serializer.data)

    # GET /api/hp_requests/<id>/schedule
    # retrieves the full schedule of a healthcare professionals for any active
    # requests they are assigned to
    # response is in the format:
    # {
    #   <date 1>: [
    #       {
    #          "start_time": <start time>,
    #          "end_time": <end time>
    #       },
    #       ...
    #   ],
    #   <date 2>: ...
    # }
    @action(methods=['GET'], detail=True)
    def schedule(self, request, pk):
        assignments = ServiceAssignment.objects.filter(
            healthcare_professional_id=pk, 
            service_request__is_completed=False
        )

        schedule = {}

        for assignment in assignments:
            serv_req = assignment.service_request

            dt = serv_req.start_date
            end_date = get_service_end_date(serv_req)

            while dt <= end_date:
                weekday = dt.isoweekday()

                # in the database dates are 0-6 (0 being sunday)
                # convert 7 to 0 for sundays
                if weekday == 7:
                    weekday = 0

                time_slots = TimeSlot.objects.filter(
                    service_assignment_id=assignment.id,
                    day=weekday
                )

                # check if any time is assigned on this day
                if len(time_slots) > 0:
                    dt_str = dt.strftime('%Y-%m-%d')

                    if dt_str not in schedule:
                        schedule.update({dt_str: []})

                    for ts in time_slots:
                        schedule[dt_str].append(
                            {
                                'service_request_id': ts.service_assignment.service_request.id,
                                'patient': f'{ts.service_assignment.service_request.patient_first_name} {ts.service_assignment.service_request.patient_last_name}',
                                'start_time': ts.start_time,
                                'end_time': ts.end_time
                            }
                        )

                dt += timedelta(days=1)

        # sort the schedule by keys (dates)
        ordered = []
        for date in schedule:
            ordered.append((date, schedule[date]))

        ordered.sort()
        sorted_schedule = {}

        for date, val in ordered:
            sorted_schedule[date] = val

        # sort times for each date in the schedule
        for date in sorted_schedule:
            sorted_schedule[date] = sorted(sorted_schedule[date], key=lambda x: x['start_time'])

        return Response(sorted_schedule)

    # GET /api/hp_requests/
    def list(self, request):
        health_pros = self.get_queryset()

        if request.query_params.get('gender'):
            health_pros = health_pros.filter(gender__iexact=request.query_params.get('gender'))

        if request.query_params.get('minAge'):
            max_dob = self.get_date_of_birth_from_age(int(request.query_params.get('minAge')))
            health_pros = health_pros.filter(date_of_birth__lte=max_dob)

        if request.query_params.get('maxAge'):
            min_dob = self.get_date_of_birth_from_age(int(request.query_params.get('maxAge')))
            health_pros = health_pros.filter(date_of_birth__gte=min_dob)

        if request.query_params.get('serviceType'):
            health_pros = health_pros.filter(service_type_id=int(request.query_params.get('serviceType')))

        # this value should be a service request ID, the data will be filtered to only
        # find healthcare professionals who match the criteria and have time in their schedule
        if request.query_params.get('eligibleForRequest'):
            health_pros = self.get_eligible_hps(int(request.query_params.get('eligibleForRequest')))

        serializer = self.serializer_class(health_pros, many=True)

        return Response(serializer.data)


    def get_eligible_hps(self, serv_req_id):
        serv_req = ServiceRequest.objects.get(id=serv_req_id)
        health_pros = HealthCareProfessional.objects.filter(service_type=serv_req.service_type)

        # filter on any of the optional requests
        if serv_req.hp_gender_required:
            health_pros = health_pros.filter(gender__iexact=serv_req.patient_gender)
        
        if serv_req.hp_min_age:
            max_dob = self.get_date_of_birth_from_age(serv_req.hp_min_age)
            health_pros = health_pros.filter(date_of_birth__lte=max_dob)

        if serv_req.hp_max_age:
            min_dob = self.get_date_of_birth_from_age(serv_req.hp_max_age)
            health_pros = health_pros.filter(date_of_birth__gte=min_dob)

        eligible_hp_ids = []

        # find healthcare professionals that have time available for this service request
        if serv_req.flexible_hours:
            # check if a healthcare professional has any time slots available between their earliest
            # start time and latest end time (based on service type)
            hp_ids = health_pros.values_list('id', flat=True)
            days_service_needed = self.get_days_service_needed(serv_req)
            serv_type = ServiceType.objects.get(id=serv_req.service_type.id)
            max_hours = time_diff(serv_type.earliest_work_time, serv_type.latest_work_time)

            for hp in hp_ids:
                # for each healthcare professionals
                # 1. check if they have existing assignments, if not, they are eligible
                # 2. check if their existing assignments start/end date overlap with the new request
                #       - if not, they are eligible
                #       - if dates overlap, check if days/times overlap
                current_assignments = ServiceAssignment.objects.filter(healthcare_professional_id=hp, service_request__is_completed=False)

                if len(current_assignments) == 0:
                    eligible_hp_ids.append(hp)
                    continue

                new_req_start_date = serv_req.start_date
                new_req_end_date = get_service_end_date(serv_req)

                current_requests = ServiceRequest.objects.filter(id__in=current_assignments.values_list('service_request_id', flat=True))
                schedule_start_date = current_requests.aggregate(Min('start_date'))['start_date__min']
                schedule_end_date = max([get_service_end_date(req) for req in current_requests])

                if new_req_start_date >= schedule_start_date and new_req_end_date <= schedule_end_date:
                    # check if there is time available in the scheudle to work on this request
                    schedule = TimeSlot.objects.filter(service_assignment_id__in=current_assignments.values_list('id', flat=True))

                    # if a time slot is found anywhere in their schedule, add the hp to the eligible list
                    for day in days_service_needed:
                        schedule_for_day = self.get_schedule_for_day(schedule.filter(day=day).order_by('start_time'))
                        found_time_slot = True if len(schedule_for_day) == 0 else False
                        hours_assigned_for_day = 0

                        # for flexibly hours, all we need to do is make sure the total hours of work assigned for the given
                        # day is less than max_hours
                        for sched in schedule_for_day:
                            hours_assigned_for_day += time_diff(sched['start_time'], sched['end_time'])

                        if hours_assigned_for_day < max_hours:
                            found_time_slot = True

                        if found_time_slot:
                            eligible_hp_ids.append(hp)
                            break
                else:
                    eligible_hp_ids.append(hp)
                    continue
        else:
            hp_ids = health_pros.values_list('id', flat=True)
            days_service_needed = self.get_days_service_needed(serv_req)

            for hp in hp_ids:
                # for each healthcare professionals
                # 1. check if they have existing assignments, if not, they are eligible
                # 2. check if their existing assignments start/end date overlap with the new request
                #       - if not, they are eligible
                #       - if dates overlap, check if days/times overlap
                current_assignments = ServiceAssignment.objects.filter(healthcare_professional_id=hp, service_request__is_completed=False)

                if len(current_assignments) == 0:
                    eligible_hp_ids.append(hp)
                    continue

                new_req_start_date = serv_req.start_date
                new_req_end_date = get_service_end_date(serv_req)

                current_requests = ServiceRequest.objects.filter(id__in=current_assignments.values_list('service_request_id', flat=True))
                schedule_start_date = current_requests.aggregate(Min('start_date'))['start_date__min']
                schedule_end_date = max([get_service_end_date(req) for req in current_requests])

                if new_req_start_date >= schedule_start_date and new_req_end_date <= schedule_end_date:
                    # check if there is time available in the scheudle to work on this request
                    schedule = TimeSlot.objects.filter(service_assignment_id__in=current_assignments.values_list('id', flat=True))

                    # if a time slot is found anywhere in their schedule, add the hp to the eligible list
                    for day in days_service_needed:
                        schedule_for_day = self.get_schedule_for_day(schedule.filter(day=day).order_by('start_time'))

                        # because of the work done in get_schedule_for_day, this check is simplified
                        # if the service request start time is earlier than their schedule start, they are available
                        # if the service request end time is later than their schedule end, they are available
                        # if the service request time span spans multiple block in their schedule, they are available
                        #   (this is because separate time block means there is a gap in between)
                        found_time_slot = True if len(schedule_for_day) == 0 else False

                        for sched in schedule_for_day:
                            # this logic encompasses all the conditions mentioned above
                            if serv_req.service_start_time < sched['start_time'] or serv_req.service_end_time > sched['end_time']:
                                found_time_slot = True
                                break

                        if found_time_slot:
                            eligible_hp_ids.append(hp)
                            break
                else:
                    eligible_hp_ids.append(hp)
                    continue

        return HealthCareProfessional.objects.filter(id__in=eligible_hp_ids)
                
    def get_schedule_for_day(self, work_times):
        # combine spans of time together to get the full schedule (regardless of request)
        # for example, if they work 8:00 - 10:00 on one request and 10:00 - 12:00 on another,
        # this schedule should contain a time block of 8:00 - 12:00
        # schedule should be a TimeSlot query set filtered down to one day of the week
        schedule = []
        
        for work_time in work_times:
            if len(schedule) == 0:
                schedule.append(
                    {
                        'start_time': work_time.start_time,
                        'end_time': work_time.end_time
                    }
                )

                continue
            
            matched_existing_record = False

            for i, timespan in enumerate(schedule):
                if work_time.start_time == timespan['end_time']:
                    schedule[i] = {
                        'start_time': timespan['start_time'],
                        'end_time': work_time.end_time
                    }

                    matched_existing_record = True

            if not matched_existing_record:
                schedule.append(
                    {
                        'start_time': work_time.start_time,
                        'end_time': work_time.end_time
                    }
                )

        return schedule

    def get_days_service_needed(self, serv_req):
        # given a service request, create a list with days of service needed
        # e.g. if service needed monday and wednesday, return [1, 3]
        days_needed = []
        if serv_req.service_needed_sunday:
            days_needed.append(0)

        if serv_req.service_needed_monday:
            days_needed.append(1)

        if serv_req.service_needed_tuesday:
            days_needed.append(2)

        if serv_req.service_needed_wednesday:
            days_needed.append(3)

        if serv_req.service_needed_thursday:
            days_needed.append(4)

        if serv_req.service_needed_friday:
            days_needed.append(5)

        if serv_req.service_needed_saturday:
            days_needed.append(6)

        return days_needed

    def get_date_of_birth_from_age(self, age):
        # given an age, calculate the maximum date of of birth they could have
        # this is done by subtracting the age from the current date
        dob = datetime.datetime.now() - relativedelta(years=age)
        dob = dob.date()

        return dob

class StaffManageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = ViewStaffMemberSerializer

    def get_queryset(self):
        return StaffMember.objects.all()

    
    def list(self, request):
        queryset = self.get_queryset()

        if request.query_params.get('active'):
            value = request.query_params.get('active')
            queryset = queryset.filter(user__is_active__exact=True if value.lower() == 'true' else False)

        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    @action(methods=['PUT'], detail=True)
    def status(self, request, pk):
        queryset = self.get_queryset()

        if not queryset.filter(id=pk).exists():
            return Response({'error':'Staff is not exist'})
        
        staff = queryset.get(id=pk)
        user_id = staff.user_id
        user = User.objects.get(id=user_id)
        
        user.is_active = not user.is_active
        user.save()
        return Response()


class CareTakerManageViewSet(viewsets.ModelViewSet):
    permission_classes = [CustomModelPermissions]
    serializer_class = ViewCareTakerMemberSerializer

    def get_queryset(self):
        return CareTaker.objects.all()


    def list(self, request):
        queryset = self.get_queryset()

        if request.query_params.get('active'):
            value = request.query_params.get('active')
            queryset = queryset.filter(user__is_active__exact=True if value.lower() == 'true' else False)

        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    @action(methods=['PUT'], detail=True)
    def status(self, request, pk):
        queryset = self.get_queryset()

        if not queryset.filter(id=pk).exists():
            return Response({'error':'Staff is not exist'})
        
        staff = queryset.get(id=pk)
        user_id = staff.user_id
        user = User.objects.get(id=user_id)
        
        user.is_active = not user.is_active
        user.save()
        return Response()

class BillingAccountViewSet(viewsets.ViewSet):
    serializer_class = BillingAccountDetailSerializer
    permission_classes = [CustomModelPermissions]

    def get_queryset(self):
        return BillingAccount.objects.all()

    # GET /api/billing_accounts
    def list(self, request):
        user = request.user
        data = self.get_queryset()

        if user.groups.filter(name='caretaker'):
            care_taker = CareTaker.objects.get(user_id=user.id)
            print(care_taker)
            requests_by_user = ServiceRequest.objects.filter(care_taker_id=care_taker.id).values_list('id', flat=True)
            print(requests_by_user)
            data = data.filter(service_request_id__in=requests_by_user)

        serializer = self.serializer_class(data, many=True)

        return Response(serializer.data)

    # GET /api/BillingAccounts/<id>
    def retrieve(self, request, pk):
        queryset = self.get_queryset().get(id=pk)
        serializer = self.serializer_class(queryset)
        billing_acct = serializer.data

        # TODO: calculate amount to be paid based on service entries
        # calculate the total amount to be paid based on hourly rate, hours per day
        # and total days of service requested
        # hourly_rate = float(service_request.service_type.hourly_rate)
        # hours_per_day = 0

        # if service_request.flexible_hours:
        #     hours_per_day = service_request.hours_of_service_daily
        # else:
        #     hours_per_day = time_diff(service_request.service_start_time, service_request.service_end_time)
        
        # total_days = service_request.days_of_service
        # amt_to_be_paid = hours_per_day * total_days * hourly_rate

        return Response(billing_acct)

class ServiceEntryViewSet(viewsets.ViewSet):
    permission_classes = [CustomModelPermissions]

    def get_queryset(self):
        return ServiceEntry.objects.all()

    # POST /api/service_entry
    # body of request should follow this schema:
    # {
    #   service_request: <req_id>
    #   start_time: HH:MM
    #   end_time: HH:MM
    # }
    def create(self, request):
        data = request.data
        data['billing_account'] = BillingAccount.objects.get(service_request_id=data['service_request']).id
        data['healthcare_professional'] = HealthCareProfessional.objects.get(user_id=request.user.id).id
        serializer = ServiceEntrySerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # GET /api/service_entry
    def list(self, request):
        hp_id = HealthCareProfessional.objects.get(user_id=request.user.id)
        entries = ServiceEntry.objects.filter(healthcare_professional=hp_id)
        serializer = ServiceEntrySerializer(entries, many=True)

        return Response(serializer.data)

    # GET /api/service_entry/<id>
    def retrieve(self, request, pk):
        entry = ServiceEntry.objects.get(id=pk)
        hp_id = HealthCareProfessional.objects.get(user_id=request.user.id).id

        if entry.healthcare_professional.id != hp_id:
            return Response({'error': 'you do not have access to this service entry'})

        serializer = ServiceEntryDetailSerializer(entry)

        return Response(serializer.data)
