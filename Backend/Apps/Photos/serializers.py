from .models import Category,Tags,Photo, SavePhotos
from Apps.User.serializers import UserSerializer
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = '__all__'
        

'''photo serializer'''
class PhotoSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(write_only=True,required=False)
    tag_names = serializers.ListField(
        child=serializers.CharField(),write_only=True,required=False
    )
    
    category = CategorySerializer(read_only=True)
    tags = TagsSerializer(many=True,read_only=True)
    uploaded_by = UserSerializer(read_only=True)
    like_count = serializers.SerializerMethodField()

    class Meta:
        model = Photo 
        fields = (
            'id',
            'title',
            'description',
            'image', 
            'location',
            'created_at', 
            'updated_at',
            'uploaded_by',
            'category', 
            'tags',
            'category_name', 
            'tag_names',
            'like_count',
        )

    def __str__(self):
        return f"Photo(id={self.id}, title={self.title})"
    
    def create(self, validated_data):
        category_name = validated_data.pop('category_name',None)
        tag_names = validated_data.pop('tag_names',[])
        if category_name:
            category,_ = Category.objects.get_or_create(name=category_name)
            validated_data['category'] = category
            
        tags = []
        if len(tag_names) > 0:
            tag_names = tag_names[0].split(',')
        
        for tag_name in tag_names:
            tag, _ = Tags.objects.get_or_create(name=tag_name)
            tags.append(tag)
        
        user = self.context['request'].user
        validated_data['uploaded_by'] = user
        
        photo = Photo.objects.create(**validated_data)
        if tags:
            photo.tags.set(tags)
        return photo
    
    def delete(self,validated_data):
        pass
                
    def get_like_count(self,obj):
        return obj.likes.count()
    
    

'''search photo serializer'''
class PhotoSearchSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    title = serializers.CharField()
    description = serializers.CharField()
    image = serializers.CharField()
    location = serializers.CharField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
    uploaded_by = serializers.DictField()
    category = serializers.DictField()
    tags = serializers.ListField()
    like_count = serializers.IntegerField(required=False, allow_null=True, default=0)
    
    def get_id(self, obj):
        return obj.meta.id  # This retrieves the actual ID

class SavePhotosSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    # photo = PhotoSerializer()
    
    class Meta:
        model = SavePhotos
        fields = '__all__'
        read_only_fields = ('user','created_at')
        
    def __str__(self):
            return f"Saved by {self.user.username} on {self.photo.title}"
    
    def validate(self, attr):
        user = self.context['request'].user
        photo = attr.get('photo')
        if SavePhotos.objects.filter(user=user,photo=photo).exists():
            raise serializers.ValidationError(f"{user.username} has already saved this photo")
        return attr
        
    def create(self,validated_data):
        user = self.context['request'].user
        
        return SavePhotos.objects.create(user=user,**validated_data)
    
    def to_representation(self, instance):
        """Customize output to include full photo data."""
        rep =  super().to_representation(instance)
        rep['photo'] = PhotoSerializer(instance.photo,context=self.context).data
        return rep