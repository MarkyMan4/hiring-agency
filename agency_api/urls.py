from django.urls import path, include
from rest_framework import routers
from knox import views as knox_views
from .auth.auth_api import RegisterStaffViewSet, LoginAPI, UserAPI, ChangePasswordAPI, LockUserAPI
from .api import EducationTypeViewSet, SecurityQuestionViewSet, SecurityQuestionAnswerViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('api/educationtypes', EducationTypeViewSet, 'education-type')
router.register('api/securityquestions', SecurityQuestionViewSet, 'security-questions')
router.register('api/securityquestionanswers', SecurityQuestionAnswerViewSet, 'security-question-answers')

urlpatterns = [
    path('', include(router.urls)),
    path('api/auth', include('knox.urls')),
    path('api/auth/register_staff', RegisterStaffViewSet.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/change_password', ChangePasswordAPI.as_view()),
    path('api/auth/lock_user', LockUserAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout')
]