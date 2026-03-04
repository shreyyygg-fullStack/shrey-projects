import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { authGuard } from './auth-guard/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [

  { path: '**', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'login?', component: LoginComponent },

  {
    path: 'ii',
    component: LayoutComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
      }]
  },


];
