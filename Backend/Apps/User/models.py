from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken
from cloudinary.models import CloudinaryField
import uuid

# Create your models here.4\
class User(AbstractUser):
    email = models.EmailField(unique=True,max_length=255,db_index=True)
    
    def __str__(self):
        return self.username
    
    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh':str(refresh),
            'access':str(refresh.access_token)
        }
    
class UserProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_image = CloudinaryField('image', blank=True, null=True, folder='profile_image/')
    bio = models.TextField(blank=True,null=True)
    
    def __str__(self):
        return self.user.username
    
    @property
    def profile_image_url(self):
        if self.profile_image:
            return self.profile_image.url
        return None