from django.urls import path,include
from Apps.Photos import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('photo',views.PhotoViewSet,basename='photos')
router.register('category',views.CategoryViewSet,basename='categorys')
router.register('tag',views.TagsViewSet,basename='tags')
router.register('save-photo',views.SavePhotosViewSet,basename='savephoto')



urlpatterns = [
    path("search-user/<str:query>/", views.SearchUSers.as_view() , name="search_user"),
    path("search-category/<str:query>/", views.SearchCategories.as_view() , name="search_category"),
    path("search-tags/<str:query>/", views.SearchTags.as_view() , name="search_tags"),
    path("search-photos/<str:query>/", views.SearchPhotos.as_view() , name="search_photos"),
    path('', include(router.urls))
]
