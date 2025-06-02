from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken

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
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_image = models.ImageField(upload_to='profile_image/',blank=True,null=True)
    bio = models.TextField(blank=True,null=True)
    
    def __str__(self):
        return self.user.username