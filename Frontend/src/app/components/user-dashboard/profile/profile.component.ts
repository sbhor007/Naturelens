import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/User/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  constructor(){

  }

  ngOnInit(): void {
  }

}
