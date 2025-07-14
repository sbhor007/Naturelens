from django.urls import path,include
from Apps.Mail import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('',views.MailViewSet,basename='mail')

urlpatterns = [
    path('', include(router.urls))
]
