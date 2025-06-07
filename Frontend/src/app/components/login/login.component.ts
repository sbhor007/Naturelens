import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';
import { LoadingComponent } from "../../loading/loading.component";
import { filter, Observable } from 'rxjs';
import { LoginState } from '../../model/models';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginState$: Observable<LoginState>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+.[a-zA-Z]{2,}$'),
        ],
      ],
      password: ['', Validators.required],
    });
    this.loginState$ = this.authService.loginState$;
    console.log('constructor:',this.loginState$);
    
  }
  
  ngOnInit(): void {
      this.loginState$ = this.authService.loginState$;
      console.log(this.loginState$);
      
      
  }
  
/*
  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const loginCredentials = this.loginForm.value;
    this.authService.login(loginCredentials).subscribe({
      next: (res) => {
        console.log(res.access);
        const tokens = res.tokens

        sessionStorage.setItem('access',tokens.access)
        sessionStorage.setItem('refresh',tokens.refresh)
        sessionStorage.setItem('username',res.username)
        this.authService.setLoginState(true)
        // alert('Login successful')
        this.isLoading = false;
        this.router.navigate(['user/'])
        
        },      
      error: (err) => {
        console.error('User Not Found', err);
        alert('User Not Found');
        this.isLoading = false;
      },
    });
  }*/
  
  login(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      alert('invalid')
    }
    console.log('login-1.0');
    const loginCredentials = this.loginForm.value;
    this.authService.login(loginCredentials)
    
  }
}
