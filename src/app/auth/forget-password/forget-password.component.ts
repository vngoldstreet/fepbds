import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { delay } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { isLoggedInState, userSignal } from '../../core/stores/user.store';
import { LoadingOverlayComponent } from '../../shared/loading-overlay/loading-overlay.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CustomValidators } from '../../validators';
import { getFormError } from '../../form-errors';

@Component({
  selector: 'app-forget-password',
  imports: [
    CommonModule,
    FormsModule,
    LoadingOverlayComponent,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  message = '';
  messageClass = '';
  success = false;
  loading = false;
  isLoggedIn = isLoggedInState;
  countdown: number = 1; // Bộ đếm 3 giây

  forgetForm: FormGroup;
  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.forgetForm.get('email')?.valueChanges.subscribe((value: string) => {
      const lower = value?.toLowerCase() ?? '';
      if (value !== lower) {
        this.forgetForm.get('email')?.setValue(lower, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.loading = true;
      this.message = `Bạn đã đăng nhập rồi. Hệ thống sẽ chuyển hướng sau ${this.countdown} giây`;
      const interval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(interval); // Dừng bộ đếm
          this.router.navigate(['']);
        }
      }, 1000);
    }
  }

  showPass: boolean = false;
  showPassword() {
    this.showPass = !this.showPass;
  }

  getError(field: string): string | null {
    const control = this.forgetForm.get(field);

    // Trường hợp đặc biệt: passwordMismatch là lỗi của cả form group
    if (
      field === 'retype_password' &&
      this.forgetForm.errors?.['passwordMismatch']
    ) {
      control?.setErrors({ passwordMismatch: true });
    }

    return getFormError(control, this.getLabel(field));
  }

  getLabel(field: string): string {
    const map: Record<string, string> = {
      name: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
      password: 'Mật khẩu',
      retype_password: 'Nhập lại mật khẩu',
    };
    return map[field] || 'Trường này';
  }

  submit() {
    if (this.forgetForm.valid) {
      this.loading = true;
      this.message = '';
      const email = this.forgetForm.get('email')?.value;
      this.auth.resetPassword$(email).subscribe({
        next: (data) => {
          this.messageClass = 'text-green-600';
          this.message = data.data.message;
          setTimeout(() => {
            this.loading = false;
            this.success = true;
          }, 1000);
        },
        error: (err: any) => {
          this.success = false;
          this.messageClass = 'text-red-600';
          this.message = err?.error?.error || 'Gửi yêu cầu thất bại.';
          this.loading = false;
        },
      });
    }
  }
}
