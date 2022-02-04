from django.urls import path, include
from rest_framework import routers
from .api import EducationTypeViewSet
# from knox import views as knox_views

router = routers.DefaultRouter(trailing_slash=False)
router.register('api/educationtypes', EducationTypeViewSet, 'education-type')

urlpatterns = [
    path('', include(router.urls))
]