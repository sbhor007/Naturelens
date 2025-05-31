import { Component } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-layout',
  imports: [RouterLink,RouterOutlet,CommonModule],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css'
})
export class HomeLayoutComponent {
  isMenuOpen:boolean = false
  navMenu:any = [
    {
      'name':'Home',
      'path':'/home'
    },
    {
      'name':'About',
      'path':'#'
    },
    {
      'name':'Explore',
      'path':'/explore'
    },
    {
      'name':'Support',
      'path':'#'
    },
    {
      'name':'Sing In',
      'path':'login'
    },
  ] 

  constructor(private router:Router){}
}
