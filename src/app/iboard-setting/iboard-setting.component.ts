import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginationDetails } from '../shared/services/indentdb.type';
import { GlobalConstants } from '../shared/common/global-constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DisplayBoardService } from '../shared/services/display-board.service';

@Component({
  selector: 'app-iboard-setting',
  templateUrl: './iboard-setting.component.html',
  styleUrls: ['./iboard-setting.component.css']
})
export class IboardSettingComponent implements OnInit {

  pageForm: FormGroup;
  pageStatus;
  pageTimer;
  pageJumpStatus;
  pageJumpNum;
  totalPages;

  isOn = false;
  isOn1 = false;
  updateFlag = true;

  paginationInfo: PaginationDetails[] = [];

  constructor(private router: Router, private fb: FormBuilder, private httpcon: HttpClient, private displayBoardService: DisplayBoardService) { }

  ngOnInit(): void {

    this.getPaginationDetails();

    this.pageForm = this.fb.group({
      pTimer: new FormControl(''),
      pJumpNum: new FormControl('')
    });

    this.pageForm.get('pJumpNum').valueChanges.subscribe(value => {
      const max = this.totalPages;
      if (value > max) {
        this.pageForm.get('pJumpNum').setValue(max, { emitEvent: false });
      }
      if (value == 0) {
        this.pageForm.get('pJumpNum').setValue(1, { emitEvent: false });
      }
    });

  }

  // toggle method for pagination status
  toggleState() {
    this.isOn = !this.isOn;

    const buttons = document.querySelectorAll('.on-off-button');
    buttons.forEach(button => button.classList.remove('active'));

    if (this.isOn) {
      document.querySelector('.on-off-button.on').classList.add('active');

      this.isOn1 = false;
      this.pageForm.get('pJumpNum').disable();
      this.pageForm.get('pJumpNum').setValue(1);

      const buttons = document.querySelectorAll('.on-off-button1');
      buttons.forEach(button => button.classList.remove('active'));
      document.querySelector('.on-off-button1.off').classList.add('active');

      this.pageForm.get('pTimer').enable();
    } else {
      this.pageForm.get('pTimer').disable();
      document.querySelector('.on-off-button.off').classList.add('active');
    }

    // if (this.isOn == false && this.isOn1 == false) {
    //   this.updateFlag = false;
    // }else {
    //   this.updateFlag = true;
    // }

  }

  // toggle method for pagination jump status
  toggleState1() {
    this.isOn1 = !this.isOn1;

    const buttons = document.querySelectorAll('.on-off-button1');
    buttons.forEach(button => button.classList.remove('active'));

    if (this.isOn1) {
      document.querySelector('.on-off-button1.on').classList.add('active');

      this.isOn = false;
      this.pageForm.get('pTimer').disable();
      const buttons = document.querySelectorAll('.on-off-button');
      buttons.forEach(button => button.classList.remove('active'));
      document.querySelector('.on-off-button.off').classList.add('active');

      this.pageForm.get('pJumpNum').enable();

    } else {
      this.pageForm.get('pJumpNum').disable();
      this.pageForm.get('pJumpNum').setValue(1);
      document.querySelector('.on-off-button1.off').classList.add('active');

    }

  //  if (this.isOn == false && this.isOn1 == false) {
  //     this.updateFlag = false;
  //   }else {
  //     this.updateFlag = true;
  //   }
  }

  //getting pagination details
  getPaginationDetails() {

    return this.httpcon.get<PaginationDetails[]>(GlobalConstants.apiPaginationDetails).pipe(map(Response => {

      this.paginationInfo = Response;
      this.totalPages = this.paginationInfo[0].TOTALPCOUNT;
      this.pageStatus = this.paginationInfo[0].PSTATUS;
      this.pageTimer = this.paginationInfo[0].PTIMER;
      this.pageJumpStatus = this.paginationInfo[0].PJUMPSTATUS;
      this.pageJumpNum = this.paginationInfo[0].PJUMPNUMBER;
      this.isOn = this.pageStatus;
      this.isOn1 = this.pageJumpStatus;

      if (this.isOn) {
        document.querySelector('.on-off-button.on').classList.add('active');
      } else {
        this.pageForm.get('pTimer').disable();
        document.querySelector('.on-off-button.off').classList.add('active');
      }
      if (this.isOn1) {
        document.querySelector('.on-off-button1.on').classList.add('active');
      } else {
        this.pageForm.get('pJumpNum').disable();
        document.querySelector('.on-off-button1.off').classList.add('active');
      }

      // if (this.isOn == false && this.isOn1 == false) {
      //   this.updateFlag = false;
      // }

      return this.paginationInfo;
    }))
      .subscribe();
  }

  // method to update the pagination inputs
  async update() {

    var pageStatus;
    if (this.isOn == true) {
      pageStatus = 1;
    } else {
      pageStatus = 0;
    }
    var pageJumpStatus;

    if (this.isOn1 == true) {
      pageJumpStatus = 1;
    } else {
      pageJumpStatus = 0;
    }
    var pageJumpNum = this.pageForm.get('pJumpNum').value;
    var pageTimer = this.pageForm.get('pTimer').value;

    (await this.displayBoardService.savePaginationDetails(pageStatus, pageJumpStatus, pageJumpNum, pageTimer)).subscribe(
      () =>
        (error) => { }
    );
  }

  // routing to home component
  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

  // routing to display board component
  iboardSettingInit() {
    this.router.navigate(['ii/iboard-setting']);
  }


}
