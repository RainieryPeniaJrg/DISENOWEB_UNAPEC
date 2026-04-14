import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/hotels', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'hotels',
    loadComponent: () => import('./pages/hotels/hotels.component').then(m => m.HotelsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'hotels/:id',
    loadComponent: () => import('./pages/hotel-detail/hotel-detail.component').then(m => m.HotelDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'sites',
    loadComponent: () => import('./pages/sites/sites.component').then(m => m.SitesComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/hotels' }
];
