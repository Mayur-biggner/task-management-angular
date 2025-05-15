import { Routes } from '@angular/router';
import { AuthGuardFn } from './services/auth-guard/auth-guard.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./view/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'tasks',
    canActivate: [AuthGuardFn],
    loadChildren: () => import('./view/task/task.routes').then((m) => m.routes),
  },
  { path: '**', redirectTo: '' },
];
