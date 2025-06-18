from django.shortcuts import render
from .serializers import CategorySerializer,TagsSerializer,PhotoSerializer, SavePhotosSerializer
from .models import Tags,Category,Photo,SavePhotos
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions,status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .permission import IsOwnerOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response


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
    
class SavePhotosViewSet(ModelViewSet):
    queryset = SavePhotos.objects.all()
    serializer_class = SavePhotosSerializer
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JWTAuthentication,) 
    
    def get_queryset(self):
        user = self.request.user
        queryset = SavePhotos.objects.filter(user=user)
        return queryset
        # return SavePhotos.objects.all()
    
    @action(detail=False,methods=['get'],url_path='count')
    def save_photo_count(self,request,*args, **kwargs):
        photo_id = request.query_params.get('photoId')
        if not photo_id:
            return Response(
                {
                    "message": "Missing 'photo' ID."
                    },
                status=status.HTTP_400_BAD_REQUEST
            )
        count = SavePhotos.objects.filter(photo=photo_id).count()
        print('*'*50,count,'*'*50)
        return Response(count,status=status.HTTP_200_OK)
    