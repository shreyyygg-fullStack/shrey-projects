import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseFormModalComponent } from '../../../expense-form-modal/expense-form-modal.component';
import { LocalFormModalComponent } from '../../../local-form-modal/local-form-modal.component';
import { PettyCashModalComponent } from '../../../petty-cash-modal/petty-cash-modal.component';
import { AuthService } from '../../../services/auth.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-my-view-home',
  standalone: true,
  imports: [LocalFormModalComponent, ExpenseFormModalComponent, NgIf, PettyCashModalComponent],
  templateUrl: './my-view-home.component.html',
  styleUrl: './my-view-home.component.scss'
})
export class MyViewHomeComponent {
  
  showExpenseForm = false;
  showLocalForm = false;
  showPettyCashForm = false;
  error: string = "";
  isGuideOn :any = false;


  constructor(private httpcon: HttpClient, private router: Router, private authService: AuthService, public sharedService: SharedService) { }

  response: string = '';

  onModalLocalFormClosed(): void {
    this.showLocalForm = false;
  }

  onModalExpenseFormClosed(): void {
    this.showExpenseForm = false;
  }

  onModalPettyCashFormClosed(): void {
    this.showPettyCashForm = false;
  }

  toggleModal(pane: string): void {
    if (pane === 'expense') {
      this.showExpenseForm = !this.showExpenseForm;
      console.log("test expense")
    } else if (pane === 'local') {
      this.showLocalForm = !this.showLocalForm;
      console.log("test local", this.showLocalForm)
    } else if (pane === 'petty') {
      this.showPettyCashForm = !this.showPettyCashForm;
      console.log("test local", this.showPettyCashForm)
    }
  }


  logout() {
    this.authService.logout().subscribe(

      (data: string) => {
        this.response = data;
        console.log("successsss logout", this.response)

        sessionStorage.setItem("auth", "false");

        this.router.navigate([`${this.response}`]);
      },
      (error) => {
        this.error = 'Invalid username or password';
        console.log("logout error--", this.error);

      }
    );
  }

  startGuideTour() {
    this.isGuideOn = true;
    
    // Reset signal to false first, then set to true again to trigger effect
    this.sharedService.guideOn.set(false);
  
    // setTimeout(() => {
      this.sharedService.guideOn.set(this.isGuideOn);
    // }, 0);
  }




}
