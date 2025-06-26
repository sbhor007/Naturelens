from django_elasticsearch_dsl import Document,fields
from django_elasticsearch_dsl.registries import registry

from .models import Photo,Category,Tags
from Apps.User.models import User

'''this tells the integration system that this document should be managed and synchronized with Elasticsearch '''
@registry.register_document #Register that document with Elastic DSL registry
class UserDocument(Document):
    class Index:
        '''Configure the elastic search index'''
        name= "users" #name of e-search index
        settings = {
            "number_of_shards":1, #Data will be split into 1 shard
            "number_of_replicas":0, # no replica
        }
    
    class Django:
        '''connects the document to the Django model'''
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
        ]

@registry.register_document
class CategoryDocument(Document):
    class Index:
        name='categories'
        settings = {
            "number_of_shards":1,
            "number_of_replicas":0,
        }
    
    class Django:
        model = Category
        fields = [
            "name"
        ]

@registry.register_document
class TagDocument(Document):
    class Index:
        name='tags'
        settings = {
            "number_of_shards":1,
            "number_of_replicas":0,
        }
    
    class Django:
        model = Tags
        fields = ("name",)

import uuid

@registry.register_document
class PhotoDocument(Document):
    
    category = fields.ObjectField(properties={
        "id":fields.TextField(),
        "name":fields.TextField(),
    })
    
    uploaded_by = fields.ObjectField(properties={
        "id":fields.IntegerField(),
        "first_name": fields.TextField(),
        "last_name": fields.TextField(),
        "username": fields.TextField(),
        "email": fields.TextField(),
        
    })
    
    tags = fields.ObjectField(properties={
        "id":fields.TextField(),
        "name":fields.TextField(),
    })
    
    # type = fields.TextField(attr="type_to_string")
    
    class Index:
        name = 'photos'
        settings = {
            "number_of_shards":1,
            "number_of_replicas":0,
        }
    
    class Django:
        model = Photo
        fields = (
            "title",
            "description",
            "image",
            "location",
            "created_at",
            "updated_at",
        )