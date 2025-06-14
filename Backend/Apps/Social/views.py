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
    
    @action(detail=False,methods=['get'],url_path='is-liked')
    def is_liked(self,request,*arg,**kwargs):
        photo_id =request.query_params.get('id')
        if not photo_id:
            return Response(
                {
                    "message": "Missing 'photo' ID."
                    },
                status=status.HTTP_400_BAD_REQUEST
            )
        if self.get_queryset().filter(photo_id=photo_id,user=self.request.user).exists():
            return Response({'isLiked':True})
        return Response({'isLiked':False})
        
    
    # like and dislike
    def create(self, request, *args, **kwargs):
        print('-'*50)
        print(request.user)
        print('-'*50)
        user = self.request.user
        photo_id = request.data.get('photo')
        
        if not photo_id:
            return Response(
                {
                    "message": "Missing 'photo' ID."
                    },
                status=status.HTTP_400_BAD_REQUEST
            )
        existing_like = self.get_queryset().filter(
            photo=photo_id,
            user=user
        )
        if existing_like.exists():
            existing_like.delete()
            return Response(
                {
                    'message':'Dislike Success',
                    'isLike':False
                },
                status=status.HTTP_200_OK,
                )
        else:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        'data':serializer.data,
                        'isLike':True
                    },
                    status=status.HTTP_200_OK,
                    )
            return Response(
                    {
                        'message':serializer.errors,
                        'isLike':False
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
    
    
    
    
        

class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    
    @action(detail=False, methods=['get'], url_path='photo-comments')
    def get_photo_comments(self,request,*args, **kwargs):
        photo_id = request.query_params.get('id')
        if not photo_id:
            return Response(
                {
                    "message":"Missing 'photo' ID."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        comments = self.queryset.filter(photo=photo_id)
        
        # if not comments > 0:
        #     return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(comments,many=True)
        print('*'*50)
        print(comments.exists())
        print('PHOTO ID : ',photo_id)
        print('SERIALIZE_DATA : ',serializer.data)
        print('*'*50)
        return Response(serializer.data,status=status.HTTP_200_OK)
