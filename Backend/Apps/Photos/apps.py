from django.apps import AppConfig


class PhotosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Apps.Photos'
    
    def ready(self):
        import Apps.Photos.signals
