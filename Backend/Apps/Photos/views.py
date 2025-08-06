from django.shortcuts import render
from .serializers import CategorySerializer,TagsSerializer,PhotoSerializer,PhotoSearchSerializer, SavePhotosSerializer
from .models import Tags,Category,Photo,SavePhotos
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions,status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .permission import IsOwnerOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page




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
    # permission_classes = (permissions.IsAuthenticated,IsOwnerOrReadOnly)
    # authentication_classes = (JWTAuthentication,) 
    
    CACHE_KEY_PREFIX = 'photo-view'
    
    def get_queryset(self):
        queryset = Photo.objects.all()
        return queryset
    
    @method_decorator(cache_page(300, key_prefix=CACHE_KEY_PREFIX))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @action(detail=False,methods=['get'],url_path='user-photos')
    def get_user_photos(self,request,*args, **kwargs):
        user = self.request.user
        photos = self.get_queryset().filter(uploaded_by=user)
        if photos.exists():
            serializer = self.serializer_class(photos,many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, *args, **kwargs):
        print('*'*50)
        print('UPDATE_PHOT'.center(50))
        print(request.data._mutable)
        # print(request)
        
        if('image' not in request.data):
            print('IMAGE NOT FOUND'.center(50))
            request.data._mutable = True
            request.data['image'] = self.get_queryset().get(id=kwargs['pk']).image
            # serializer = self.get_serializer(request.data)
            return super().update(request, *args, **kwargs)
        return super().update(request, *args, **kwargs)
    
class SavePhotosViewSet(ModelViewSet):
    queryset = SavePhotos.objects.all()
    serializer_class = SavePhotosSerializer
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JWTAuthentication,) 
    
    def get_queryset(self):
        user = self.request.user
        queryset = SavePhotos.objects.filter(user=user).order_by('?')
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
    
'''Implementing Elastic search'''
import abc
from elasticsearch_dsl import Q
from .documents import PhotoDocument,UserDocument,CategoryDocument,TagDocument
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.views import APIView

class PaginatedElasticSearchAPIView(APIView,LimitOffsetPagination):
    serializer_class = None
    document_class = None
    
    @abc.abstractmethod
    def generate_q_expression(self,query):
        '''This method should be overridden and return a Q() expression'''
    
    def get(self,request,query):
        try:
            q = self.generate_q_expression(query)
            search = self.document_class.search().query(q)
            print('-'*50)
            print("SEARCH: ",search)
            print('Query: ',q)
            print('-'*50)
            response = search.execute()
            print('*'*50)
            print(f'Found {response.hits.total.value} hit\'s for query: "{query}"')
            print('*'*50)
            result = self.paginate_queryset(response.hits, request, view=self)
            print('*'*50)
            print(f'Result : {result}')
            print('*'*50)
            serializer = self.serializer_class(result,many=True)
            return self.get_paginated_response(serializer.data)
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from Apps.User.serializers import UserSerializer
class SearchUSers(PaginatedElasticSearchAPIView):
    '''User elastic search'''
    serializer_class = UserSerializer
    document_class = UserDocument
    
    def generate_q_expression(self, query):
        return Q(
            "bool",
            should=(
                Q("match",username=query),
                Q("match",first_name=query),
                Q("match",last_name=query),
            ), minimum_should_match = 1
        )

class SearchCategories(PaginatedElasticSearchAPIView):
    serializer_class = CategorySerializer
    document_class = CategoryDocument
    
    def generate_q_expression(self, query):
        return Q(
            "multi_match", 
            query=query,
            fields=(
                "name",
            )
        )
        
class SearchTags(PaginatedElasticSearchAPIView):
    serializer_class = TagsSerializer
    document_class = TagDocument
    
    def generate_q_expression(self, query):
        return Q(
            "multi_match", 
            query=query,
            fields=(
                "name",
            )
        )
from dateutil.parser import parse

class SearchPhotos(PaginatedElasticSearchAPIView):
    serializer_class = PhotoSearchSerializer
    document_class = PhotoDocument
    
    def generate_q_expression(self, query):
        return Q(
            "multi_match", 
            query=query,
            fields = (
                "title",
                "description",
                "image",
                "category.name",
                "uploaded_by.username",
                "uploaded_by.first_name",
                "uploaded_by.last_name",
                "tags.name",
                "location",
                # "created_at",
            ),
            fuzziness="auto"
        )