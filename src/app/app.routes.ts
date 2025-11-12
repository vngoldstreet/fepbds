import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SearchingComponent } from './pages/searching/searching.component';

export const routes: Routes = [
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
];
