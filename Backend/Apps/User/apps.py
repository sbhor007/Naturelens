from django.apps import AppConfig


class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Apps.User'
    
    def ready(self):
        import Apps.User.signals