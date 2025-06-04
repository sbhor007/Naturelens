import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

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
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    }
    const loginCredentials = this.loginForm.value;
    this.authService.login(loginCredentials).subscribe({
      next: (res) => {
        console.log(res.access);
        const tokens = res.tokens

        sessionStorage.setItem('access',tokens.access)
        sessionStorage.setItem('refresh',tokens.refresh)
        sessionStorage.setItem('username',res.username)
        this.authService.setLoginState(true)
        alert('Login successful')
        this.router.navigate(['user/'])
        
        },      
      error: (err) => {
        console.error('User Not Found', err);
        alert('User Not Found');
      },
    });
  }
}
