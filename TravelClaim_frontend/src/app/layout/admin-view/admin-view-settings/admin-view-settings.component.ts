import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-admin-view-settings',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './admin-view-settings.component.html',
  styleUrl: './admin-view-settings.component.scss'
})
export class AdminViewSettingsComponent {




  userControl: boolean = false;
  organization: boolean = false;
  currentUrl: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    if (this.currentUrl === "/ii/admin-view/settings/organization-profile") {
      this.organization = true;
    } else if (this.currentUrl === "/ii/admin-view/settings/users") {
      this.userControl = true;
    } else if (this.currentUrl === "/ii/admin-view/settings/global-setting") {
      this.userControl = true;
    } else if (this.currentUrl === "/ii/admin-view/settings") {
      this.router.navigate(['/ii/admin-view/settings/users'])
    }else if (this.currentUrl === "/ii/admin-view/settings/policy") {
      this.organization = true;
    }

  }


  navigateUsers() {
    this.router.navigate(['/ii/admin-view/settings/users'])
  }

  navigateGlobalSetting() {
    this.router.navigate(['/ii/admin-view/settings/global-setting'])

  }

  navigateOganizationProfile() {
    this.router.navigate(['/ii/admin-view/settings/organization-profile'])
  }
  navigatePolicy() {
    this.router.navigate(['/ii/admin-view/settings/policy'])
  }

  userAndControl() {
    this.userControl = !this.userControl;
  }

  organizationTab() {
    this.organization = !this.organization;
  }

  activeTab(tabName: string): boolean {
    return this.router.url.toLowerCase().includes(tabName.toLowerCase());
  }




}
