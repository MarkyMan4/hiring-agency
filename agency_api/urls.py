from django.urls import path, include
from rest_framework import routers
from knox import views as knox_views
from .auth.auth_api import EasyRegisterViewSet, RegisterStaffViewSet, LoginAPI, UserAPI, ChangePasswordAPI, LockUserAPI
from .api import (
    BillingAccountViewSet,
    CreateServiceAssignmentViewSet,
    EducationTypeViewSet,
    PaymentViewSet,
    PendingPaymentViewSet, 
    SecurityQuestionViewSet, 
    SecurityQuestionAnswerViewSet, 
    JobPostingViewSet,
    ServiceAssignmentViewSet,
    ServiceEntryViewSet,
    ServiceTypeViewSet, 
    ViewHPJobApplicationViewSet,
    CreateHPJobApplicationViewSet,
    CreateCareTakerRequestViewSet, 
    CareTakerRequestViewSet,
    CreateServiceRequestViewSet,
    RetrieveServiceRequestViewSet,
    HPJobApplicationViewSet,
    HPViewSet,
    StaffManageViewSet,
    CareTakerManageViewSet
)

# viewsets can be registered here
router = routers.DefaultRouter(trailing_slash=False)
router.register('api/educationtypes', EducationTypeViewSet, 'education-type')
router.register('api/service_types', ServiceTypeViewSet, 'service-types')
router.register('api/securityquestions', SecurityQuestionViewSet, 'security-questions')
router.register('api/securityquestionanswers', SecurityQuestionAnswerViewSet, 'security-question-answers')
router.register('api/jobposting', JobPostingViewSet, 'job-posting')
router.register('api/createjobapplications', CreateHPJobApplicationViewSet, 'job-posting')
router.register('api/viewjobapplications', ViewHPJobApplicationViewSet, 'job-posting')
router.register('api/caretaker_requests', CareTakerRequestViewSet, 'care-taker-requests')
router.register('api/create_service_requests', CreateServiceRequestViewSet, 'create-service-requests')
router.register('api/retrieve_service_requests', RetrieveServiceRequestViewSet, 'retrieve-service-requests')
router.register('api/create_service_assignment', CreateServiceAssignmentViewSet, 'create-service-assignment')
router.register('api/service_assignments', ServiceAssignmentViewSet, 'service-assignments')
router.register('api/hp_job_application',HPJobApplicationViewSet, 'job-application')
router.register('api/hp_requests', HPViewSet, 'job-application')
router.register('api/view_staff_list',StaffManageViewSet, 'staff-list')
router.register('api/view_caretaker_list',CareTakerManageViewSet, 'care-taker-list')
router.register('api/billing_accounts', BillingAccountViewSet, 'billing-accounts')
router.register('api/service_entry', ServiceEntryViewSet, 'service-entry')
router.register('api/hp_payments', PaymentViewSet, 'payment')
router.register('api/pending_payments', PendingPaymentViewSet, 'pending-payments')


# put non-viewset urls here
urlpatterns = [
    path('', include(router.urls)),
    path('api/auth', include('knox.urls')),
    path('api/auth/register_staff', RegisterStaffViewSet.as_view()),
    # path('api/auth/easy_reg', EasyRegisterViewSet.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/change_password', ChangePasswordAPI.as_view()),
    path('api/auth/lock_user', LockUserAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('api/create_caretaker_request', CreateCareTakerRequestViewSet.as_view(), name='create-care-taker-request')
]