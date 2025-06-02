from django.shortcuts import render
from .models import User
from .models import UserProfile
from rest_framework import viewsets,status,permissions
from .serializers import UserSerializer,UserRegisterSerializer,UserProfileSerializer,UserLoginSerializer,LogoutSerializer
from rest_framework import generics 
from rest_framework.response import Response
from rest_framework.permissions import  AllowAny

class UserProfileDetails(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]
    
# class CreateUserView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     AllowAny()
    
class UserDetailsView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
class RegisterView(generics.GenericAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes =(permissions.AllowAny,)
    
    def post(self,req):
        serializer = self.serializer_class(data=req.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes =(permissions.AllowAny,)
    def post(self,req):
        serializer = self.serializer_class(data=req.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


class LogoutView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self,req):
        serializer = LogoutSerializer(data=req.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)