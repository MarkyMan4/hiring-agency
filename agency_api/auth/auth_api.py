import string
import secrets
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth.models import update_last_login, Group
from django.contrib.auth import authenticate
from knox.models import AuthToken
from ..serializers import StaffMemberSerializer
from .auth_serializers import UserSerializer, RegisterStaffMemberSerializer, LoginSerializer
from ..models import AccountStatus

def is_password_valid(password):
    specials = '~!@#$%^&*+'
    alphanumeric = string.ascii_letters + string.digits
    allowed_chars = alphanumeric + specials
    is_valid = True

    # make sure password contains special characters, alphanumeric characters and is at least six characters
    if any(p in alphanumeric for p in password) and any(p in specials for p in password) and (len(password) >= 6):
        # make sure password only contains alphanumeric characters and special characters
        for c in password:
            if c not in allowed_chars:
                is_valid = False
                break
    else:
        is_valid = False

    return is_valid

# registering staff member, this can only be done by an administrator
class RegisterStaffViewSet(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        # should return some kind of error response if any values are missing
        # or the front end could enforce this
        generated_password = self.gen_rand_pass()

        user_data = {
            'first_name': request.data['first_name'],
            'last_name': request.data['last_name'],
            'username': f"{request.data['last_name']}01",
            'password': generated_password,
            'email': request.data['email']
        }

        # create the user object
        user_serializer = RegisterStaffMemberSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

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

        # finally, add the user to the staff group
        staff_group = Group.objects.get(name='staff')
        staff_group.user_set.add(user)

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'initialPassword': generated_password,
            'token': AuthToken.objects.create(user)[1]
        })
    
    def gen_rand_pass(self):
        specials = '~!@#$%^&*+'
        alphabet = string.ascii_letters + string.digits + specials

        while True:
            password = ''.join(secrets.choice(alphabet) for i in range(10))
            if(is_password_valid(password)):
                return password


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

        user = authenticate(username=username, password=old_pass)

        if user:
            # make sure new password is not the same as old password
            if old_pass == new_pass:
                return Response({
                    'error': 'new password cannot be the same as old password'
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
