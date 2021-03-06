from django.contrib.auth.views import LogoutView
from django.urls import path

from .views import HomeView, LoginView

app_name = 'common'

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('author/<author>', HomeView.as_view(), name='author'),
    path('repo/<repo>', HomeView.as_view(), name='repo'),
    path('repos', HomeView.as_view(), name='repos'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
]
