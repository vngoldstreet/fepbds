import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { isLoggedInState, userSignal } from '../../core/stores/user.store';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  user!: any;
  constructor(
    private router: Router,
    private location: Location,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  userSignal = userSignal;
  isLoggedIn = isLoggedInState;
  private sanitizer = inject(DomSanitizer);
  navItemsForBrowser: {
    label: string;
    link: string;
    icon?: SafeHtml;
  }[] = [];
  ngOnInit(): void {
    this.navItemsForBrowser = [
      {
        label: 'Trang chủ',
        link: '/',
        icon: this
          .sanitizeIcon(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"
          class="icon icon-tabler icon-tabler-home size-4">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
          <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
          <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
        </svg>`),
      },
      {
        label: 'Tìm kiếm',
        link: '/tim-kiem',
        icon: this.sanitizeIcon(
          `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-search size-4"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>`
        ),
      },
      {
        label: 'Blog',
        link: '/blog',
      },
    ];
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const currentUrl = this.location.path();
    if (currentUrl !== '') {
      this.selectedIndex = this.getNavIndex(this.location.path());
    }
    this.cdr.detectChanges();
  }

  sanitizeIcon(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getNavIndex(link: string): number {
    return this.navItemsForBrowser.findIndex((item) => item.link === link);
  }
  CheckRole(role: string | undefined) {
    if (role === 'admin') {
      return true;
    }
    if (role === 'moderator') {
      return true;
    }
    return false;
  }

  selectedIndex: number = 0;

  setActive(index: number): void {
    setTimeout(() => {
      this.selectedIndex = index;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  isDropdown = false;
  toggleDropdown() {
    this.isDropdown = !this.isDropdown;
  }
  clickOnMenuDropdown(item: any) {
    this.isDropdown = !this.isDropdown;
    this.redirectTo(item.link);
  }
  redirectTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.auth.logout$();
  }
}
