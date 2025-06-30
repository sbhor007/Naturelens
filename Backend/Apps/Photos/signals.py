from django.db.models.signals import pre_save,post_delete
from django.dispatch import receiver
from .models import Photo

@receiver(pre_save,sender=Photo)
def auto_delete_image_on_change(sender,instance,*args, **kwargs):
    if not instance.pk:
        return False
    
    try:
        old_image = sender.objects.get(pk=instance.pk).image
    except sender.DoesNotExist:
        return False
    
    new_image = instance.image
    if not old_image == new_image:
        if old_image and old_image.storage.exists(old_image.name):
            old_image.delete(save=False)


@receiver(post_delete,sender=Photo)
def auto_delete_image_on_delete(sender,instance,*args, **kwargs):
    image = instance.image
    if image and image.storage.exists(image.name):
        image.delete(save=False)