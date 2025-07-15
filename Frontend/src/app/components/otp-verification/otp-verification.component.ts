import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OTPService } from '../../services/Email/otp.service';

@Component({
  selector: 'app-otp-verification',
  imports: [ReactiveFormsModule],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css',
})
export class OtpVerificationComponent {
  otpVerificationForm: FormGroup<any>;

  @Input() userEmail: string = '';

  @Output() isOtpVerified = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder, private otpService: OTPService) {
    this.otpVerificationForm = this.fb.group({
      input1: ['', Validators.required],
      input2: ['', Validators.required],
      input3: ['', Validators.required],
      input4: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.otpVerificationForm.invalid) {
      this.otpVerificationForm.markAllAsTouched();
      return;
    }
    const OTP = Object.values(this.otpVerificationForm.value).join('');
    console.log('OTP : ', OTP);

    try {
      this.otpService
        .verifyOTP(this.userEmail, OTP)
        .subscribe((result: boolean) => {
          if (result) {
            this.isOtpVerified.emit(true);
            console.log('OTP Verified:', this.otpVerificationForm.value);
            this.otpVerificationForm.reset();
          } else {
            console.log('Invalid Otp');
          }
        });
    } catch (err) {
      console.log('onSubmit::Error::', err);
    }
  }

  // resend otp
  resendOtp() {}
}
