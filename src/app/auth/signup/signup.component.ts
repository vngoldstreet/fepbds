import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  MinLengthValidator,
  MinValidator,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isLoggedInState } from '../../core/stores/user.store';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { LoadingOverlayComponent } from '../../shared/loading-overlay/loading-overlay.component';
import { AuthService } from '../../shared/services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CustomValidators } from '../../validators';
import { getFormError } from '../../form-errors';
import { filter } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    LoadingOverlayComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  registerForm: FormGroup;
  message = '';
  messageClass: string = '';
  success = false;
  loading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, CustomValidators.name()]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, CustomValidators.vietnamPhone()]],
        password: [
          '',
          [Validators.required, CustomValidators.passwordStrength()],
        ],
        retype_password: ['', [Validators.required]],
      },
      {
        validators: CustomValidators.matchFields('password', 'retype_password'),
      }
    );
    this.registerForm.get('email')?.valueChanges.subscribe((value: string) => {
      const lower = value?.toLowerCase() ?? '';
      if (value !== lower) {
        this.registerForm.get('email')?.setValue(lower, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {}
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
  showRetypePass: boolean = false;
  showPassword() {
    this.showPass = !this.showPass;
  }
  showRetypePassword() {
    this.showRetypePass = !this.showRetypePass;
  }

  getError(field: string): string | null {
    const control = this.registerForm.get(field);

    // Trường hợp đặc biệt: passwordMismatch là lỗi của cả form group
    if (
      field === 'retype_password' &&
      this.registerForm.errors?.['passwordMismatch']
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
    if (this.registerForm.valid) {
      this.loading = true;
      this.message = 'Đang xử lý';
      this.auth.register$(JSON.stringify(this.registerForm.value)).subscribe({
        next: () => {
          this.success = true;
          this.message = 'Đăng ký thành công';
          this.messageClass = 'text-green-700';
          setTimeout(() => {
            this.message = 'Đang xử lý đăng nhập...';
            const email = this.registerForm.get('email')?.value;

            const password = this.registerForm.get('password')?.value;
            this.auth.login$(email, password).subscribe({
              next: () => {
                this.success = true;
                this.message = 'Đăng nhập thành công!';
                setTimeout(() => {
                  this.router.navigate(['']);
                }, 1000);
              },
              error: (err: any) => {
                this.success = false;
                this.message = err?.error?.error || 'Đăng nhập thất bại.';
                this.loading = false;
              },
            });
          }, 1000);
        },
        error: (err: any) => {
          console.log(err);
          this.success = false;
          this.messageClass = 'text-red-600';
          this.message = err?.error?.error?.message || 'Đăng ký thất bại.';
          this.loading = false;
        },
      });
    }
  }
}
