from django.urls import path, include
from rest_framework import routers
from knox import views as knox_views
from .auth.auth_api import RegisterStaffViewSet, LoginAPI, UserAPI, ChangePasswordAPI, LockUserAPI
from .api import (
    EducationTypeViewSet, 
    SecurityQuestionViewSet, 
    SecurityQuestionAnswerViewSet, 
    JobPostingViewSet, 
    ViewHPJobApplicationViewSet,
    CreateHPJobApplicationViewSet,
    CreateCareTakerRequestViewSet, 
    CareTakerRequestViewSet,
    CreateServiceRequestViewSet,
    RetrieveServiceRequestViewSet
)

# viewsets can be registered here
router = routers.DefaultRouter(trailing_slash=False)
router.register('api/educationtypes', EducationTypeViewSet, 'education-type')
router.register('api/securityquestions', SecurityQuestionViewSet, 'security-questions')
router.register('api/securityquestionanswers', SecurityQuestionAnswerViewSet, 'security-question-answers')
router.register('api/jobposting', JobPostingViewSet, 'job-posting')
router.register('api/createjobapplications', CreateHPJobApplicationViewSet, 'job-posting')
router.register('api/viewjobapplications', ViewHPJobApplicationViewSet, 'job-posting')
router.register('api/caretaker_requests', CareTakerRequestViewSet, 'care-taker-requests')
router.register('api/create_service_requests', CreateServiceRequestViewSet, 'create-service-requests')
router.register('api/retrieve_service_requests', RetrieveServiceRequestViewSet, 'retrieve-service-requests')

# put non-viewset urls here
urlpatterns = [
    path('', include(router.urls)),
    path('api/auth', include('knox.urls')),
    path('api/auth/register_staff', RegisterStaffViewSet.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/change_password', ChangePasswordAPI.as_view()),
    path('api/auth/lock_user', LockUserAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('api/create_caretaker_request', CreateCareTakerRequestViewSet.as_view(), name='create-care-taker-request')
]