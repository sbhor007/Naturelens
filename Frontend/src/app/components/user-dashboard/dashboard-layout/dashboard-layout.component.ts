import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/Auth/auth.service';
import { it } from 'node:test';
import { UserService } from '../../../services/User/user.service';


@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterModule, CommonModule, RouterLink],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit {
  
  icons: any[] = [
    {
      name: 'home',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      route: '/user/explore' // Changed from '/user' to '/user/explore'
    },
    {
      name: 'post',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        
          <path d="M18 2c2.206 0 4 1.794 4 4v12c0 2.206-1.794 4-4 4H6c-2.206 0-4-1.794-4-4V6c0-2.206 1.794-4 4-4zm0-2H6a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6z" fill="#000000" opacity="1"/>
          <path d="M12 18a1 1 0 0 1-1-1V7a1 1 0 0 1 2 0v10a1 1 0 0 1-1 1z" fill="#000000" opacity="1"/>
          <path d="M6 12a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1z" fill="#000000" opacity="1"/>
        
      </svg>`,
      route: '/user/create-post'
    },
    {
      name: 'search',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
        <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      route: '/user/search' // Changed from '#' to actual route
    },
    {
      name: 'profile',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      route: '/user/profile'
    },
    {
      name: 'logout',
      icon: `<svg fill="" width="24px" height="24" viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M156.31,43.63a9.9,9.9,0,0,0-14,14,60.1,60.1,0,1,1-85,0,9.9,9.9,0,0,0-14-14c-31,31-31,82,0,113s82,31,113,0A79.37,79.37,0,0,0,156.31,43.63Zm-56.5,66.5a10,10,0,0,0,10-10v-70a10,10,0,0,0-20,0v70A10,10,0,0,0,99.81,110.13Z"></path></svg>`,
      route: '/user/profile'
    }
  ];

  isMobile = false;

  user:string | undefined 

  constructor(
    private sanitizer: DomSanitizer, 
    private authService: AuthService,
    private userService: UserService,
    public router: Router 
  ) {}

  ngOnInit() {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
    this.user = this.authService.getUsername()?.charAt(0)
    this.getProfile()
    
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  navigateTo(path: string): void {
    if (path && path !== '#') {
      console.log(path);
      
      this.router.navigate([path]);
    }
  }

  handleNavigation(item:any){
    if (item.name == 'logout'){
      this.logout()
    }else{
      this.navigateTo(item.route)
    }
  }

  logout(){
    this.authService.logout().subscribe({
      next: res =>{
        this.authService.setLoginState(false)
        this.authService.removeToken()
        alert('logout successfully')
        this.router.navigate(['home'])
      },
      error: err =>{
        console.log('error: ',err);
        
        alert('logout error')
      }
    })
  }

  getProfile(){
    this.userService.getProfile().subscribe({
      next: res =>{
        if (res.length > 0){
          this.userService.setProfileState(true)
          // this.isProfileAvailable = true
          this.userService.setProfileData(res[0])
          // this.profileData = res[0]

          // this.profileForm.patchValue({
          //   bio:this.profileData.bio || ''
          // })
          
          // setting image preview if it is available
          // if(this.profileData.profile_image){
          //   this.imagePreview = this.profileData.profile_image
          //   this.isImage = true
          // }          
        }else{
          this.userService.setProfileState(false)
          // this.isProfileAvailable = false
        }
        // alert('profile Available')        
      },
      error: err =>{
        this.userService.setProfileState(false)
        // this.isProfileAvailable = false
        // this.profileData = null
        this.userService.setProfileData(null)
        // this.imagePreview = null
        console.log('error : ',err);
        alert('profile not Available')        
      } 
    })
  }
}