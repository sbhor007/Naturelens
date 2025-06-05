import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/User/user.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/Auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [RouterModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  username:string | null = null
  ch:string = ''
  imagePreview:string | ArrayBuffer | null = null
  isImage = true
  isProfileAvailable:boolean = false
  profile_image = ''

  constructor(private authService:AuthService,private userService:UserService){

  }

  ngOnInit(): void {
    this.username = this.authService.getUsername()
    this.ch = this.username ? this.username.charAt(0) : ''
    this.isProfileAvailable = this.userService.isProfileAvailable()
      if(this.isProfileAvailable){
        console.log("hello");
          this.imagePreview = this.userService.getProfileData().profile_image
          console.log('image preview : ',this.imagePreview)
          this.isImage = true
      }
  }

}
