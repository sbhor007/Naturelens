from django.db.models.signals import pre_delete,pre_save,post_save
from django.dispatch import receiver
from .models import UserProfile,User
import cloudinary.uploader

@receiver(pre_save,sender=UserProfile)
def delete_old_image_on_update(sender,instance,**kwargs):
    """Deletes the old Cloudinary image when the profile_image is updated."""
    if instance.pk:
        try:
            old_instance = UserProfile.objects.get(pk=instance.pk)
            if old_instance.profile_image and old_instance.profile_image != instance.profile_image:
                # Delete the old image from Cloudinary
                cloudinary.uploader.destroy(old_instance.profile_image.public_id)
        except UserProfile.DoesNotExist:
            pass

# @receiver(post_save, sender=User)
# def create_user_profile(sender,instance,created, **kwargs):
#     if created:
#         UserProfile.objects.create(user=instance)

@receiver(pre_delete, sender=UserProfile)
def delete_image_on_profile_delete(sender,instance, **kwargs):
    """Deletes the Cloudinary image when the UserProfile instance is deleted."""
    if instance.profile_image:
        cloudinary.uploader.destroy(instance.profile_image.public_id)