from rest_framework import serializers
from .models import PhotoLike,Comment
from Apps.Photos.serializers import PhotoSerializer
from Apps.User.serializers import UserSerializer


class PhotoLikeSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    total_likes = serializers.IntegerField(read_only=True)
    class Meta:
        model = PhotoLike
        fields = ('id', 'photo', 'user','total_likes','created_at')
        read_only_fields = ('user','created_at')
        
        
    def __str__(self):
        return f"{self.user.username} liked {self.photo.title}"
    
    def create(self, validated_data):
        user = self.context['request'].user
        return PhotoLike.objects.create(user=user, **validated_data)

    
    
    

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('user','created_at')
        
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.photo.title}"
    
    def create(self, validated_data):
        user = self.context.get('request').user
        return Comment.objects.create(user=user,**validated_data)