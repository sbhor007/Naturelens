from django.urls import path,include
from Apps.User import views
from rest_framework.routers import DefaultRouter



urlpatterns = [
    path("register/",views.CreateUserView.as_view()),
    path("users/<int:pk>/",views.UserDetailsView.as_view())
]
