from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth.models import update_last_login, Group
from django.contrib.auth import authenticate
from knox.models import AuthToken
from ..serializers import CareTakerSerializer, HealthCareProfessionalSerializer, StaffMemberSerializer
from .auth_serializers import UserSerializer, RegisterUserSerializer, LoginSerializer
from ..models import AccountStatus
from ..utils.validation import is_password_valid
from ..utils.account import gen_rand_pass
from ..utils.templates import email_template
from django.core.mail import send_mail
from django.conf import settings

class EasyRegisterViewSet(generics.GenericAPIView):
    def post(self, request):
        user_data = {
            'first_name': request.data['first_name'],
            'last_name': request.data['last_name'],
            'username': f"{request.data['last_name']}",
            'password': request.data['password'],
            'email': request.data['email'],
        }

        group = request.data['group']

        # create the user object
        user_serializer = RegisterUserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        
        # update username to have sequence number
        user.username = user.username + str(user.id).zfill(2)
        user.save()

        if group == 'staff':
            # use the user object to create the staff member
            staff_member_data = {
                'user': user.id,
                'address': request.data['address'],
                'phone_number': request.data['phone_number'],
                'email': request.data['email'],
            }

            staff_member_serializer = StaffMemberSerializer(data=staff_member_data)
            staff_member_serializer.is_valid(raise_exception=True)
            staff_member_serializer.save()

            # add the user to the staff group
            staff_group = Group.objects.get(name='staff')
            staff_group.user_set.add(user)

            return Response({
                'user': UserSerializer(user, context=self.get_serializer_context()).data,
                'token': AuthToken.objects.create(user)[1]
            })
        elif group == 'caretaker':
            # use the user object to create the staff member
            caretaker_data = {
                'user': user.id,
                'address': request.data['address'],
                'phone_number': request.data['phone_number'],
                'email': request.data['email'],
            }

            caretaker_serializer = CareTakerSerializer(data=caretaker_data)
            caretaker_serializer.is_valid(raise_exception=True)
            caretaker_serializer.save()

            # add the user to the staff group
            caretaker_group = Group.objects.get(name='caretaker')
            caretaker_group.user_set.add(user)

            return Response({
                'user': UserSerializer(user, context=self.get_serializer_context()).data,
                'token': AuthToken.objects.create(user)[1]
            })
        elif group == 'healthcareprofessional':
            hp_data ={
                'user':user.id,
                'gender': request.data['gender'],
                'date_of_birth':request.data['date_of_birth'],
                'ssn':request.data['ssn'],
                'service_type':request.data['service_type'],
                'education_type':request.data['education_type'],
                'education_institution':request.data['education_institution'],
                'graduation_year':request.data['graduation_year'],
                'graduation_month':request.data['graduation_month'],
                'years_of_experience':request.data['years_of_experience'],
                'address':request.data['address'],
                'phone_number':request.data['phone_number'],
                'email':request.data['email'],
                'hourly_rate':request.data['hourly_rate']
            }

            HCP_serializer = HealthCareProfessionalSerializer(data=hp_data)
            HCP_serializer.is_valid(raise_exception=True)
            HCP_serializer.save()

            heathCareProfessional_group = Group.objects.get(name='healthcareprofessional')
            heathCareProfessional_group.user_set.add(user)

            return Response({
                'user': UserSerializer(user, context=self.get_serializer_context()).data,
                'token': AuthToken.objects.create(user)[1]
            })


# registering staff member, this can only be done by an administrator
class RegisterStaffViewSet(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        # should return some kind of error response if any values are missing
        # or the front end could enforce this
        generated_password = gen_rand_pass()

        user_data = {
            'first_name': request.data['first_name'],
            'last_name': request.data['last_name'],
            'username': f"{request.data['last_name']}",
            'password': generated_password,
            'email': request.data['email']
        }

        # create the user object
        user_serializer = RegisterUserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        
        # update username to have sequence number
        user.username = user.username + str(user.id).zfill(2)
        user.save()

        # use the user object to create the staff member
        staff_member_data = {
            'user': user.id,
            'address': request.data['address'],
            'phone_number': request.data['phone_number'],
            'email': request.data['email'],
        }

        staff_member_serializer = StaffMemberSerializer(data=staff_member_data)
        staff_member_serializer.is_valid(raise_exception=True)
        staff_member_serializer.save()

        # add the user to the staff group
        staff_group = Group.objects.get(name='staff')
        staff_group.user_set.add(user)

        # send an email with the first time login credentials
        send_mail(
            'New staff account',
            email_template.format(username=user.username, password=generated_password),
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'token': AuthToken.objects.create(user)[1]
        })


# for logging in
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        # front end needs to know if it's the first login so they can prompt user to
        # change password and enter security questions
        is_first_login = False

        if not user.last_login:
            is_first_login = True

        # update last log in for next time
        update_last_login(None, user)

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'isFirstLogin': is_first_login,
            'token': AuthToken.objects.create(user)[1]
        })

# retrieve info for the currently logged in user
class UserAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        user = self.request.user
        serializer = self.get_serializer(user)
        data = serializer.data
        data['is_locked'] = AccountStatus.objects.get(user_id=user.id).is_locked

        # include the groups this user is part of
        groups = [group.name for group in user.groups.all()]

        # admin doesn't have any groups since they already have all permissions, so include all groups
        # so the front end can handle admin users properly
        if user.is_superuser:
            groups = [group.name for group in Group.objects.all()]
            groups.append('admin') # also include admin so the front end can easily determine if the user is an admin
        
        data['groups'] = groups

        return Response(data)

class LockUserAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    # POST /api/auth/lock_user
    def post(self, request):
        user = self.request.user
        status = AccountStatus.objects.get(user_id=user.id)
        status.is_locked = True
        status.save()

        return Response()

class ChangePasswordAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    # POST /api/auth/change_password
    # user must be logged in
    # verify that they correctly entered their old password
    # then set the new password
    def post(self, request):
        username = self.request.user.username
        old_pass = request.data['old_pass']
        new_pass = request.data['new_pass']
        con_pass = request.data['con_pass']

        user = authenticate(username=username, password=old_pass)

        if user:
            # make sure new password is not the same as old password
            if old_pass == new_pass:
                return Response({
                    'error': 'new password cannot be the same as old password'
                })

            if con_pass != new_pass:
                return Response({
                    'error': 'confirm password should same as new password'
                })

            # make sure the password meets minimum requirements
            if is_password_valid(new_pass):
                user.set_password(new_pass)
                user.save()
                return Response()
            else:
                return Response({
                    'error': 'password must be at least six characters, only contain alphanumeric characters and at least one of the following: ~, !, @, #, $, %, ^, &, *, +'
                })
        else:
            return Response({
                'error': 'old password is incorrect'
            })
