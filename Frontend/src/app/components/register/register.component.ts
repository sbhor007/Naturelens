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
import { UserService } from '../../services/User/user.service';

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
    private userService:UserService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      first_name:['',Validators.required],
      last_name:['',Validators.required],
      username: [''],
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

    this.registrationForm.get('email')?.valueChanges.subscribe((email) => {
  this.registrationForm.get('username')?.setValue(email, { emitEvent: false });
});
  }

  register(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    this.userService.register(this.registrationForm.value)
    this.registrationForm.reset();
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
