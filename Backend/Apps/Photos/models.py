from django.db import models
import uuid
from Apps.User.models import User

class Category(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,null=False)
    name = models.CharField(max_length=100,unique=True)
    

class Tags(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,null=False)
    name = models.CharField(max_length=100,unique=True)

class Photo(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,null=False)
    title = models.CharField(max_length=100,null=False,blank=False)
    description = models.TextField(blank=True,null=True)
    image = models.ImageField(upload_to='mediafiles/',blank=False,null=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE,related_name='photos')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE,related_name='uploaded_photos')
    tags = models.ManyToManyField(Tags,related_name='photos')
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class SavePhotos(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4,editable=False)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='user')
    photo = models.ForeignKey(Photo,on_delete=models.CASCADE,related_name='saved_photos')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'saved_photo'
        constraints = [
            models.UniqueConstraint(fields=['user', 'photo'], name='unique_save_photo')
        ]
    
    
    
    




    