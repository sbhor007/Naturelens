from rest_framework import serializers
from .models import User
from .models import UserProfile
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken,TokenError

class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = UserProfile
        fields = ['id','profile_image', 'bio', 'user']
        
    
    

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    class Meta:
        model = User
        fields = ('id','first_name','last_name','username','email','profile')    
    
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
    
        
class UserRegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(max_length = 40,write_only=True)
    last_name = serializers.CharField(max_length = 40,write_only=True)
    password = serializers.CharField(max_length = 68,min_length=8,write_only=True)
    class Meta:
        model = User
        fields = ('first_name','last_name','username','email','password')
        
    def validate(self,attrs):
        email = attrs.get('email','')
        username = attrs.get('username','')
        if not username:
            raise serializers.ValidationError(
                self.default_error_messages
            )
        return attrs
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
        
class UserLoginSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=68,min_length=8,write_only=True)
    username = serializers.CharField(max_length=255,min_length=3)
    tokens = serializers.SerializerMethodField()
    
    def get_tokens(self,obj):
        user = User.objects.get(username=obj['username'])
        return {
            'refresh':user.tokens()['refresh'],
            'access':user.tokens()['access']
        }
    
    class Meta:
        model = User
        fields = ('email','username','password')
    
    def validate(self,attrs):
        username = attrs.get('username','')
        password = attrs.get('password','')
        user = auth.authenticate(username=username,password=password)
        if not user:
            raise AuthenticationFailed('invalid credentials, try again')
        if not user.is_active:
            raise AuthenticationFailed('Account disabled, contact admin')
        return{
            'email':user.email,
            'username':user.username,
            'tokens':user.tokens
        }
            
        
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs
    
    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail('bad_token')
    


    