from django.urls import path,include
from Apps.Photos import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('photo',views.PhotoViewSet,basename='photos')
router.register('category',views.CategoryViewSet,basename='categorys')
router.register('tag',views.TagsViewSet,basename='tags')
router.register('save-photo',views.SavePhotosViewSet,basename='savephoto')



urlpatterns = [
    path('', include(router.urls))
]
