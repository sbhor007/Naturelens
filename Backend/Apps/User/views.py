from django.shortcuts import render
from django.contrib.auth.models import User
from .models import UserProfile
from rest_framework import viewsets,status
from .serializers import UserSerializer
from rest_framework import generics 
from rest_framework.response import Response

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
class UserDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    