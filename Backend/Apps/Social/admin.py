from django.contrib import admin
from .models import PhotoLike,Comment


# Register your models here.
@admin.register(PhotoLike)
class PhotoLikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'photo_id','user_id')
    search_fields = ('id',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'photo','user','comment')
    search_fields = ('comment',)