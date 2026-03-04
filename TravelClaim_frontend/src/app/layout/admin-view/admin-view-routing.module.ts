import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminViewHomeComponent } from './admin-view-home/admin-view-home.component';
import { AdminViewSettingsComponent } from './admin-view-settings/admin-view-settings.component';
import { AvUsersComponent } from './admin-view-settings/user-and-controls/av-users/av-users.component';
import { AvGlobalSettingsComponent } from './admin-view-settings/user-and-controls/av-global-settings/av-global-settings.component';
import { AvOrganizationProfileComponent } from './admin-view-settings/organization/av-organization-profile/av-organization-profile.component';
import { AvPolicyComponent } from './admin-view-settings/organization/av-policy/av-policy.component';

const routes: Routes = [

  { path: 'home', component: AdminViewHomeComponent },

   {
      path: 'settings',
      component: AdminViewSettingsComponent,
      children: [
        { path: 'users', component: AvUsersComponent },
        { path: 'global-setting', component: AvGlobalSettingsComponent },
        { path: 'organization-profile', component: AvOrganizationProfileComponent },
        { path: 'policy', component: AvPolicyComponent },
      ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminViewRoutingModule { }
