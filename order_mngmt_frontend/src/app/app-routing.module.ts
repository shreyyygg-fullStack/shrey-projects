import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { AdminGuard } from './authguard/admin.guard';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  }, {
    path: 'ii',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
        {
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
  }]},
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true}), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
