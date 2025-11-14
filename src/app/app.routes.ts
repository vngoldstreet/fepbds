import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SearchingComponent } from './pages/searching/searching.component';
import { UploadComponent } from './shared/upload/upload.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

export const routes: Routes = [
  {
    path: 'dang-nhap',
    component: LoginComponent,
  },
  {
    path: 'dang-ky',
    component: SignupComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomepageComponent,
  },
  {
    path: 'tim-kiem',
    canActivate: [AuthGuard],
    component: SearchingComponent,
  },
  {
    path: 'upload',
    canActivate: [AuthGuard],
    component: UploadComponent,
  },
];
