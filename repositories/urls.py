from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'repositories'

router = DefaultRouter()
router.register(r'commits', views.CommitViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(
        r'^api/repositories/',
        views.repository_create_view,
        name='repositories-create'),
]
