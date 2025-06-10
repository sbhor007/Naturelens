
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', views.health_check, name='health_check'),
    path('api/v1/user/',include('Apps.User.urls')),
    path('api/v1/photos/', include('Apps.Photos.urls'))
] +  static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
