from django.contrib import admin
from .models import Photo, Category, Tags

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category_id', 'uploaded_by', 'created_at')
    search_fields = ('title', 'location')
    list_filter = ('category_id', 'uploaded_by', 'created_at')