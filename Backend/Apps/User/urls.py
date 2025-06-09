from django.urls import path,include
from Apps.User import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register('profile',views.UserProfileDetails,basename='userprofile')
router.register('details',views.UserDetailsView,basename='userdetail')



urlpatterns = [
    path('',include(router.urls)),
    path("register/",views.RegisterView.as_view(), name="register"),
    path("login/",views.LoginView.as_view(), name="login"),
    path("logout/",views.LogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(),name='token_refresh'),
]
