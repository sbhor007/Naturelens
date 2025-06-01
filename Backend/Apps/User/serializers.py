from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    class Meta:
        model = User
        fields = ('id','username','email','profile')    
    
    def create(self, validated_data):
        profile_data = validated_data.pop('profile',{})
        user = User.objects.create_user(
            username= validated_data['username'],
            email=validated_data.get('email',''),
            password=validated_data.get('password','')
        )
        UserProfile.objects.create(user=user,**profile_data)
        return user
    
    def update(self,instance,validated_data):
        profile_data = validated_data.pop('profile',{})
        instance.username = validated_data.get('username',instance.username)
        instance.email = validated_data.get('email',instance.email)
        
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()
        
        '''update or create profile'''
        profile,created = UserProfile.objects.get_or_create(user=instance)
        profile.profile_image = profile_data.get('profile_image',profile.profile_image)
        profile.save()
        return instance
    
        
