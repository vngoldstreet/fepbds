import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-confirm-reset',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './confirm-reset.component.html',
  styleUrl: './confirm-reset.component.css',
})
export class ConfirmResetComponent {
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  message = '';
  messageClass = '';
  countdown: number = 3;
  countdownText: string = ``;

  updateTime() {
    if (this.countdown == 0) {
      this.router.navigate(['']);
      return;
    }
    this.countdown--;
    this.countdownText = `${this.countdown} giây!`;
  }
  private intervalId: any;

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token') || '';
    this.auth.confirmResetPassword$(token).subscribe({
      next: () => {
        this.countdownText = `${this.countdown} giây!`;
        this.message = `Reset mật khẩu thành công. Vui lòng kiểm tra email để nhận mật khẩu mới! Hệ thống sẽ tự động chuyển hướng sau: `;
        this.messageClass = 'text-green-600';
        this.intervalId = setInterval(() => this.updateTime(), 1000);
      },
      error: (err: any) => {
        this.countdownText = `${this.countdown} giây!`;
        this.message =
          'Yêu cầu đã hết hạn. Quý khách vui lòng gửi lại yêu cầu thay đổi mật khẩu mới! Hệ thống sẽ tự động chuyển hướng sau: ';
        this.intervalId = setInterval(() => this.updateTime(), 1000);
        this.messageClass = 'text-red-600';
      },
    });
  }
}
