from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import PhotoLike,Comment
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication 
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import PhotoLikeSerializer,CommentSerializer
import logging
from rest_framework import status
from Apps.Photos.models import Photo
from Apps.Photos.serializers import PhotoSerializer

logger = logging.getLogger(__name__)

class PhotoLikeViewSet(ModelViewSet):
    # queryset = PhotoLike.objects.all()
    serializer_class = PhotoLikeSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    
    def get_queryset(self):
        return PhotoLike.objects.all()
    
    @action(detail=False, methods=['get'], url_path='like-count')
    def like_count(self, request,*arg,**kwargs):        
        photo_id = request.query_params.get("id")
        photo = Photo.objects.get(id=photo_id)
        serializer = PhotoSerializer(photo)
        return Response(serializer.data['like_count'],status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        print('-'*50)
        print(request.data['photo'],request.data['user'])
        print('-'*50)
        photo_liked = self.get_queryset().filter(
            photo=self.request.data['photo'],
            user=self.request.data['user']
        )
        print('-'*50)
        print(photo_liked.exists())
        print('-'*50)
        if photo_liked.exists():
            photo_liked.delete()
            return Response({'message':'Dislike Success','status':status.HTTP_200_OK})
        else:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response({'message':'Something went to wrong','status':status.HTTP_400_BAD_REQUEST})
    
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    
        

class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
