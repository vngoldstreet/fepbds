import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomepageComponent } from './pages/homepage/homepage.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomepageComponent,
  },
];
