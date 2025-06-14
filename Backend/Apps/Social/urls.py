
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('photo-like',views.PhotoLikeViewSet,basename='photoLike')
router.register('comment',views.CommentViewSet,basename='comments')
# path('', include(router.urls))

urlpatterns = [
   path('', include(router.urls))
]
