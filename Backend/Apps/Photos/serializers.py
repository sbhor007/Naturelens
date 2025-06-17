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
        print('*'*50)
        print(f"validated data : {validated_data}")
        print('*'*50)
        
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
        
        print(f"{'-'*50}")
        print(str(tags))
        print(tag_names)
        print('-'*50)
        
        user = self.context['request'].user
        validated_data['uploaded_by'] = user
        
        photo = Photo.objects.create(**validated_data)
        if tags:
            photo.tags.set(tags)
            
        print('*'*50)
        print(f"photo : {photo}")
        print('*'*50)
        
        return photo
                
    def get_like_count(self,obj):
        return obj.likes.count()
    

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