from rest_framework import serializers
from .models import PhotoLike,Comment
from Apps.Photos.serializers import PhotoSerializer
from Apps.User.serializers import UserSerializer


class PhotoLikeSerializer(serializers.ModelSerializer):
    # photo = PhotoSerializer(read_only=True)
    # user = UserSerializer(read_only=True)
    total_likes = serializers.IntegerField(read_only=True)
    class Meta:
        model = PhotoLike
        fields = ('id', 'photo', 'user','total_likes')
        
    def __str__(self):
        return f"{self.user.username} liked {self.photo.title}"

class CommentSerializer(serializers.ModelSerializer):
    # photo = PhotoSerializer(read_only=True)
    # user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = '__all__'
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.photo.title}"