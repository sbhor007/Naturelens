import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/Auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+.[a-zA-Z]{2,}$'),
        ],
      ],
      password: ['', [Validators.required, this.passwordValidator]],
    });
  }

  register(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registrationForm.value).subscribe({
      next: (res) => {
        console.log('Registration Successfully');
        alert('Registration Successful!');
        this.registrationForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      },
    });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const errors: any = {};

    if (!/[a-z]/.test(value)) {
      errors.lowercase = 'At least one lowercase letter is required.';
    }

    if (!/[A-Z]/.test(value)) {
      errors.uppercase = 'At least one uppercase letter is required.';
    }

    if (!/[0-9]/.test(value)) {
      errors.number = 'At least one number is required.';
    }

    if (!/[@$!%*?&]/.test(value)) {
      errors.special =
        'At least one special character (@ $ ! % * ? &) is required.';
    }

    if (value.length < 8) {
      errors.minlength = 'Password must be at least 8 characters long.';
    }

    return Object.keys(errors).length ? errors : null;
  }
}
