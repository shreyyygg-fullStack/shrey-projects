import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-view-approvals',
  standalone: true,
  imports: [NgClass, NgIf,NgbPopover],
  templateUrl: './my-view-approvals.component.html',
  styleUrl: './my-view-approvals.component.scss'
})
export class MyViewApprovalsComponent {


  activeTab: string = 'pending_approvals';

  report: string = "";

}
