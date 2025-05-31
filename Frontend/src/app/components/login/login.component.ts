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
      email: [
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
    const user = this.loginForm.value;
    this.authService.login(user.email).subscribe({
      next: (res) => {
        console.log(res[0].password);

        if (res[0].password == user.password) {
          console.log('User Login successfully');
          alert('Login SuccessFull');
          this.loginForm.reset();
          this.router.navigate(['/home']);
          return;
        }
        console.log('Invalid Password');
        alert('Invalid Password');
        this.loginForm.reset();
      },
      error: (err) => {
        console.error('User Not Found', err);
        alert('User Not Found');
      },
    });
  }
}
