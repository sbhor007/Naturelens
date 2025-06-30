from django.shortcuts import render
from .models import User
from .models import UserProfile
from rest_framework import viewsets,status,permissions
from .serializers import UserSerializer,UserRegisterSerializer,UserProfileSerializer,UserLoginSerializer,LogoutSerializer
from rest_framework import generics 
from rest_framework.response import Response
from rest_framework.permissions import  AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import PermissionDenied,ValidationError

class UserProfileDetails(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        print('create: ',self.request.data)
        if UserProfile.objects.filter(user=self.request.user).exists():
            raise ValidationError("Profile already exists.")
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("You cannot update another user's profile.")
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You cannot delete another user's profile.")
        instance.delete()
    

    
class UserDetailsView(viewsets.ModelViewSet):    
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def get_queryset(self):
        return User.objects.filter(username=self.request.user.username)
    
    
class RegisterView(generics.GenericAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes =(permissions.AllowAny,)
    
    def post(self,req):
        serializer = self.serializer_class(data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class LoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes =(permissions.AllowAny,)
    def post(self,req):
        serializer = self.serializer_class(data=req.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


class LogoutView(generics.GenericAPIView):
    # permission_classes = (permissions.IsAuthenticated,)
    def post(self,req): 
        serializer = LogoutSerializer(data=req.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)