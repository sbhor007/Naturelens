import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/User/user.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  constructor(){

  }

  ngOnInit(): void {
  }

}
