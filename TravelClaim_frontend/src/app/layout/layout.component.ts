import { NgIf, NgClass } from '@angular/common';
import { Component, effect, Injector } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UiTourService } from '../services/ui-tour.service';
import { MyViewTripsComponent } from './my-view/my-view-trips/my-view-trips.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, RouterOutlet, NgbTooltip, RouterLink, MyViewTripsComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  constructor(private router: Router, private authService: AuthService, private sharedService: SharedService, private uiTourService: UiTourService) {
    effect(() => {
      const guideStart = this.sharedService.guideOn();
      console.log("start tour", guideStart);

      if (guideStart == true) {
        this.startTour();
      }
    });
  }

  showPettyCashForm = false;

  isCollapsed: boolean = false;
  iswidden: boolean = false;
  response: string = '';
  error: string = "";
  viewTravelPolicy: boolean = true;
  policyState: boolean = false;
  isModalOpen: boolean = false;
  myView: boolean = false;
  adminView: boolean = false;



  ngOnInit(): void {

    if (this.router.url == "/ii/my-view/home" || this.router.url == "/ii/my-view/approvals" || this.router.url == "/ii/my-view/expenses" || this.router.url == "/ii/my-view/analytics") {
      this.myView = true;
    } else {
      this.myView = false;
    }

    if (this.router.url == "/ii/admin-view/home" || this.router.url == "/ii/admin-view/settings/users" || this.router.url == "/ii/admin-view/settings/organization-profile" || this.router.url == "/ii/admin-view/settings/policy" || this.router.url == "/ii/admin-view/settings/global-setting") {
      this.adminView = true;
    } else {
      this.adminView = false;
    }

    const storedCollapsed = localStorage.getItem('isCollapsed');
    const storedWidden = localStorage.getItem('iswidden');

    if (storedCollapsed !== null) {
      this.isCollapsed = storedCollapsed === 'true';
    }

    if (storedWidden !== null) {
      this.iswidden = storedWidden === 'true';
    }
  }


  tripsModal() {
    this.showPettyCashForm = true;
  }

  onModalPettyCashFormClosed(): void {
    this.showPettyCashForm = false;
  }

  toggleMenu(menu: string) {
    if (menu === 'myView') {
      // this.myView = !this.myView;
      if (this.myView) {
        this.adminView = false;
      } else if (!this.myView) {
        this.myView = true;
        this.adminView = false;
      }

    } else if (menu === 'adminView') {
      this.adminView = !this.adminView;

      if (this.adminView) {
        this.myView = false;
      } else if (!this.adminView) {
        this.myView = true;
      }
    }

    if (this.myView) {
      this.router.navigate(['/ii/my-view/home']);
    }

    if (this.adminView) {
      this.router.navigate(['/ii/admin-view/home']);
    }
  }



  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.iswidden = !this.iswidden;

    localStorage.setItem('isCollapsed', this.isCollapsed.toString());
    localStorage.setItem('iswidden', this.iswidden.toString());
  }

  closeSidebar() {
    this.isCollapsed = false;
    this.iswidden = false;

    localStorage.setItem('isCollapsed', this.isCollapsed.toString());
    localStorage.setItem('iswidden', this.iswidden.toString());
  }


  logout() {

    this.isModalOpen = false;
    this.authService.logout().subscribe(

      (data: string) => {
        this.response = data;
        if (this.response == "Logout Successful") {
          console.log("successsss logout", this.response)
          sessionStorage.setItem("auth", "false");
          this.router.navigate([`/login`]);
        }
      },
      (error) => {
        this.error = 'Invalid username or password';
        console.log("logout error--", this.error);
      }
    );
  }


  activeTab(tabName: string): boolean {
    return this.router.url.toLowerCase().includes(tabName.toLowerCase());
  }

  policyView() {

    // this.policyState = !this.policyState;
    // // this.sharedService.changeBooleanState(this.policyState);
    // console.log(this.policyState)
    // this.sharedService.booleanState.set(this.policyState);
  }

  startTour() {
    console.log("called guide")
    const steps = [
      { title: 'Welcome', intro: 'Welcome to Ishida Expense', position: 'right' },
      { element: '#home', title: 'Stay ahead of expense', intro: 'Add your expense manually, View your pending entities at one place and manage your expense', position: 'right' },
      { element: '#trips', title: ' Manage all Trips ', intro: 'Manage your all trip ', position: 'right' },
      { element: '#expenses', title: 'Manage individual travel expense', intro: 'Mange your expense like Petty cash, Conveyance. Modify or Delete youe expenses ans final submit of your expense ', position: 'right' },
      { element: '#reports', title: 'Reports of all expense', intro: 'You can upload your documents like bills and other attachments and See Your Report', position: 'right' },
      { element: '#advances', title: 'Advances expense claim', intro: 'You can fill the details of conveyance here and click + to add more', position: 'right' },
      { element: '#approvals', title: 'Approvals Pendings', intro: 'To submit the claim, click on the save button.', position: 'right' },
      { element: '#analytics', title: 'Analysis of Report', intro: 'To submit the claim, click on the save button.', position: 'right' },
      { element: '#mySetting', title: 'Setting ', intro: 'To submit the claim, click on the save button.', position: 'right' }


    ];


    this.uiTourService.startTour(steps);
    // this.sharedService.guideOn.set(false);
  }


}
