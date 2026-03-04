import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyViewHomeComponent } from './my-view-home/my-view-home.component';
import { MyViewApprovalsComponent } from './my-view-approvals/my-view-approvals.component';
import { MyViewExpensesComponent } from './my-view-expenses/my-view-expenses.component';
import { MyViewAnalyticsComponent } from './my-view-analytics/my-view-analytics.component';
import { MyViewTripsComponent } from './my-view-trips/my-view-trips.component';

const routes: Routes = [

    { path: 'home', component: MyViewHomeComponent },
    { path: 'approvals', component: MyViewApprovalsComponent },
    { path: 'expenses', component: MyViewExpensesComponent },
    { path: 'analytics', component: MyViewAnalyticsComponent },
    { path: 'trips', component: MyViewTripsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyViewRoutingModule { }
