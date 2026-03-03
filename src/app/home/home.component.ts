import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NextActionDataList, revisedDateList } from '../shared/services/indentdb.type';
import { NgbModalRef, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DetailsTemplateComponent } from '../shared/details-template/details-template.component';
import { GlobalConstants } from '../shared/common/global-constants';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  globalClickflag;
  nextActionList: NextActionDataList[] = [];
  btnPIColor = true;
  revisedNextDate: revisedDateList[] = [];
  currListExpandIndex;
  current = -1;

  indentSheetNumber: string;
  modalRef: NgbModalRef;
  indentAllFormDetail: boolean;
  globalEnableButtons: boolean = false;
  showFileManagement: boolean = false;
  showFileUpload: boolean = false;
  showIboard: boolean = false;
  globalUserRole: string = "";
  constructor(private router: Router, private httpcon: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    this.getTodayNextActionList();
    this.indentAllFormDetail = false;
    this.globalUserRole = GlobalConstants.globalUserRole; 
    if (this.globalUserRole == 'User') {
      this.showFileManagement = true;
      this.showFileUpload = false;
      this.showIboard = false;
    }
    
    if (this.globalUserRole == 'Superuser') {
      this.globalEnableButtons = false;
      this.showFileManagement = true;
      this.showFileUpload = true;
      this.showIboard = true;
    }
    else if (this.globalUserRole == 'Administrator' || this.globalUserRole == 'Ishida') {
      this.globalEnableButtons = true;
      this.showFileManagement = true;
      this.showFileUpload = true;
      this.showIboard = true;
    }
  }

  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

  dashboardInit() {
    this.router.navigate(['ii/dashboard']);
  }

  iboardPlanningInit() {
    this.router.navigate(['ii/iboard-planning']);
  }

  indentMagmentInit() {
    this.router.navigate(['ii/indentmgmt']);
  }

  serviceMagmentInit() {
    this.router.navigate(['ii/service-management']);
  }

  userMagmentInit() {
    this.router.navigate(['ii/usermanagement']);
  }

  fileMagmentInit() {
    this.router.navigate(['ii/file']);
  }

  indentListInit() {
    this.router.navigate(['ii/indentlist']);
  }


  getTodayNextActionList() {
    this.httpcon.get<NextActionDataList[]>(GlobalConstants.apiNextActionToday)
      .pipe(map(Response => {
        if (Response.length !== 0) {
          this.nextActionList = Response;
          this.indentAllFormDetail = true;
        } else {
          this.indentAllFormDetail = false;
        }
        return Response;
      }))
      .subscribe();
  }


  onModalOpenDetailDialog(indentNo) {
    if (this.globalClickflag) {
      this.globalClickflag = false;
      return;
    }
    GlobalConstants.globalNxtActIndNo = "";
    this.indentSheetNumber = indentNo;

    this.modalRef = this.modalService.open(DetailsTemplateComponent, {
      backdrop: 'static',
      keyboard: false
    });
    this.modalRef.componentInstance.my_modal_title = 'details-template';
    this.modalRef.componentInstance.my_modal_content = indentNo;
    this.modalRef.componentInstance.indentSheetNumber = this.indentSheetNumber;
  }

}
