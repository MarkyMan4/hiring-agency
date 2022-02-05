from django.urls import path, include
from rest_framework import routers
from knox import views as knox_views
from .auth.auth_api import RegisterStaffViewSet, LoginAPI, UserAPI
from .api import EducationTypeViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('api/educationtypes', EducationTypeViewSet, 'education-type')

urlpatterns = [
    path('', include(router.urls)),
    path('api/auth', include('knox.urls')),
    path('api/auth/register_staff', RegisterStaffViewSet.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout')
]