from django.db import models
import uuid
from Apps.Photos.models import Photo
from Apps.User.models import User


# Create your models here.
class PhotoLike(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4,editable=False)
    photo = models.ForeignKey(Photo,on_delete=models.CASCADE,related_name='likes')
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='photo_likes')
    
    '''
    when using ForeignKey fields in Django models, you can't apply unique=True directly to multiple fields together. Instead, Django uses the Meta class with unique_together or the newer constraints syntax to enforce multi-field uniqueness
    '''
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['photo', 'user'], name='unique_photo_user_like')
        ]
        
class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4,editable=False)
    photo = models.ForeignKey(Photo,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    comment = models.TextField(blank=True,null=True)
    
    