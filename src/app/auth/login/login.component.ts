import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { isLoggedInState, userSignal } from '../../core/stores/user.store';
import { LoadingOverlayComponent } from '../../shared/loading-overlay/loading-overlay.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CustomValidators } from '../../validators';
import { getFormError } from '../../form-errors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingOverlayComponent,
    ReactiveFormsModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  message = '';
  messageClass = '';
  success = false;
  loading = false;
  isLoggedIn = isLoggedInState;
  countdown: number = 1; // Bộ đếm 3 giây

  loginForm: FormGroup;
  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.loginForm.get('email')?.valueChanges.subscribe((value: string) => {
      const lower = value?.toLowerCase() ?? '';
      if (value !== lower) {
        this.loginForm.get('email')?.setValue(lower, { emitEvent: false });
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

  private firstLoadDone = false;
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.firstLoadDone) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.firstLoadDone = true;
        }
      });
  }

  showPass: boolean = false;
  showPassword() {
    this.showPass = !this.showPass;
  }

  getError(field: string): string | null {
    const control = this.loginForm.get(field);

    // Trường hợp đặc biệt: passwordMismatch là lỗi của cả form group
    if (
      field === 'retype_password' &&
      this.loginForm.errors?.['passwordMismatch']
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
    if (this.loginForm.valid) {
      this.loading = true;
      this.message = '';
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.auth.login$(email, password).subscribe({
        next: () => {
          this.success = true;
          this.messageClass = 'text-green-600';
          this.message = 'Đăng nhập thành công!';
          setTimeout(() => {
            this.router.navigate(['']);
          }, 2000);
        },
        error: (err: any) => {
          console.log(err);
          this.success = false;
          this.messageClass = 'text-red-600';
          this.message =
            err?.error?.error?.message ||
            'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập!';
          this.loading = false;
        },
      });
    }
  }
}
