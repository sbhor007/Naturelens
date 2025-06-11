from django.shortcuts import render
from .serializers import CategorySerializer,TagsSerializer,PhotoSerializer
from .models import Tags,Category,Photo
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from .permission import IsOwnerOrReadOnly

# Create your views here.

class TagsViewSet(ModelViewSet):
    queryset = Tags.objects.all()
    serializer_class = TagsSerializer
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)  

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)  

class PhotoViewSet(ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = (permissions.IsAuthenticated,IsOwnerOrReadOnly)
    authentication_classes = (JWTAuthentication,)   
    
    def get_queryset(self):
        """
        Optionally restricts the returned photos to a given user,
        by filtering against a `mine` query parameter in the URL.
        """
        queryset = Photo.objects.all()
        mine = self.request.query_params.get('mine')
        print('-'*50)
        print(self.request)
        print(self)
        print('-'*50)
        
        if mine == 'true':
            queryset = queryset.filter(uploaded_by=self.request.user)
        return queryset
    
     
    
    

        
    
