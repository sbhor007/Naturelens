from django.shortcuts import render
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from django.core.mail import send_mail

# Create your views here.
class MailViewSet(ViewSet):
    
    @action(detail=False,methods=['GET'],url_path='send-otp')
    def send_otp(self,request):
        send_mail(
            "Subject here",
            "Here is the message.",
            "sbhor132@gmail.com",
            ["sbhor747@gmail.com"],
            fail_silently=False,
        )
        
    