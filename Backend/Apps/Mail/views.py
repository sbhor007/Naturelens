from django.shortcuts import render
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from django.core.mail import send_mail
import time
import random

# Create your views here.
class MailViewSet(ViewSet):
    
    __user_otp = dict()
    
    def __generate_otp(self,email='sbhor747@gmail.com'):
        print('gen-otp-all',email)
        otp = random.randint(1000,9999)
        if email in self.__user_otp:
            print('hii')
            self.__user_otp[email] = {
                self.__user_otp[email]['otp']:otp,
                self.__user_otp[email]['expiry_time']:time.time() + 300 
            }
        else:
            print('hello')
            self.__user_otp[email] = {
                'otp':otp,
                'expiry_time':time.time() + 300
            }
        
        print(self.__user_otp)
        
        
        # if MailViewSet.__user_otp in 
        return otp
    
    def __verify_otp(self,email,otp):
        print('ver-otp-all',email,otp)
        if email in self.__user_otp:
            if self.__user_otp[email]['expiry_time'] > time.time():
                if self.__user_otp[email]['otp'] == otp:
                    return True
        return False
        
    '''send otp'''
    @action(detail=False,methods=['POST'],url_path='send-otp')
    def send_otp(self,request):
        email =  request.query_params.get('email')
        print('*'*50)
        print(f"Mail service call {email}".center(50))
        print('*'*50)
        res =  send_mail(
            "Naturelens - OpTP Verification",
            f"Your OTP for Naturelens is: {self.__generate_otp(email=email)} . Please do not share this with anyone.",
            "sbhor132@gmail.com",
            [email],
            fail_silently=False,
        )
        # res = self.__generate_otp()
        if res:
            return Response({"message": "Mail sent successfully","OTP":res}, status=status.HTTP_200_OK)  
        return Response({"message": "Mail sending failed"}, status=status.HTTP_400_BAD_REQUEST)
    
    
    '''verify otp'''
    @action(detail=False,methods=['POST'],url_path='verify-otp')
    def verify_otp(self,request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if email == None or email == "":
            return Response({"message":"Email is required"},status=status.HTTP_400_BAD_REQUEST)
        
        if otp == None or otp == "":
            return Response({"message":"OTP is required"},status=status.HTTP_400_BAD_REQUEST)
        
        if self.__verify_otp(email,otp):
            return Response({"message":"OTP verified successfully"},status=status.HTTP_200_OK)
        return Response({"message":"Invalid OTP"},status=status.HTTP_400_BAD_REQUEST)
        
    