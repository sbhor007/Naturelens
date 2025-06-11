from .models import Category,Tags,Photo
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
            'tag_names'
        )
    
    def create(self, validated_data):
        print('*'*50)
        print(f"validated data : {validated_data}")
        print('*'*50)
        
        category_name = validated_data.pop('category_name',None)
        tag_names = validated_data.pop('tag_names',[])
        # get or create category
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
                
    
    # To allow writing category and tags, add their id fields
    # category_id = serializers.PrimaryKeyRelatedField(
    #     queryset=Category.objects.all(), source='category', write_only=True, required=False
    # )
    # tags_ids = serializers.PrimaryKeyRelatedField(
    #     queryset=Tags.objects.all(), source='tags', many=True, write_only=True, required=False
    # )