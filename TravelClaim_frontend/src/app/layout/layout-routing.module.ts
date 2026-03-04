import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproverViewComponent } from '../approver-view/approver-view.component';
import { authGuard } from '../auth-guard/auth.guard';

const routes: Routes = [

  {
    path: 'admin-view',
    // canActivate: [authGuard],
    loadChildren: () => import('./admin-view/admin-view.module').then((m) => m.AdminViewModule)
  },

  {
    path: 'my-view',
    // canActivate: [authGuard],
    loadChildren: () => import('./my-view/my-view.module').then((m) => m.MyViewModule)
  },


  { path: 'approver-view', component: ApproverViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
