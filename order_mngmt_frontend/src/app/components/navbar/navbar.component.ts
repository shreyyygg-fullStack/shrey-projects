import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService, NgxUiLoaderModule } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/app/shared/common/global-constants';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [CommonServiceService],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit {

  //global variable.
  globalRequiredMsg: string;
  globalIncorrectPassMsg: string;
  globalDiffNewAndCurrentPassMsg: string;
  globalInvalidPasswordMsg: string;
  globalDiffPasswordMsg: string;

  userRole = sessionStorage["role"];
  loginUsrName;
  modalReference: NgbModalRef;
  modalReference2: NgbModalRef;
  passwordPattern = '^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^!&*+=]).*$' //"^(?=.*?[0-9])(?=.*?[#?!@$%^&*-])(?=.*?[A-Za-z]).{6,}$";  // password must have atleast 6 length and must include one number and one special character with 1 capital letter.
  readonly: boolean = true;
  changePasswordForm: FormGroup;
  public isAdmin: boolean = false;
  fieldTextType: boolean;
  currPassFieldType: boolean;
  newPassFieldType: boolean;
  confPassFieldType: any;
  isPassChange: boolean;
  currPassword: string;

  userChecked: boolean = false;
  superUserChecked: boolean = false;
  adminChecked: boolean = false;
  ishidaChecked: boolean = false;
  globalReadOnly: boolean = false;
  isCurrPassMatched: boolean = true;

  constructor(private router: Router, private fb: FormBuilder, private modalService: NgbModal, private httpcon: HttpClient, private commonService: CommonServiceService, private encdec: EncryptionService, private ngxService: NgxUiLoaderService) {

    this.changePasswordForm = this.fb.group({
      curr_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
      confirm_password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
    },
      { validator: [this.MustMatch('new_password', 'confirm_password')] });

  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }


  ngOnInit() {
    this.globalRequiredMsg = GlobalConstants.globalRequiredMsg;
    this.globalIncorrectPassMsg = GlobalConstants.globalIncorrectPassMsg;
    this.globalDiffNewAndCurrentPassMsg = GlobalConstants.globalDiffNewAndCurrentPassMsg;
    this.globalInvalidPasswordMsg = GlobalConstants.globalInvalidPasswordMsg;
    this.globalDiffPasswordMsg = GlobalConstants.globalDiffPasswordMsg;

    this.loginUsrName = sessionStorage.getItem('username');
    this.currPassword = GlobalConstants.glabalUserLoginPass;
    this.userRole = sessionStorage.getItem('role');
    this.getRolePriority(this.userRole);
    GlobalConstants.globalUserRole = this.userRole;
    if (sessionStorage.getItem('role') == "ADMINISTRATOR" || sessionStorage.getItem('role') == "Administrator" || sessionStorage.getItem('role') == "Ishida") {
      this.isAdmin = true;
      GlobalConstants.globalEnableButtons = true;
    }
    else {
      this.isAdmin = false;
      GlobalConstants.globalEnableButtons = false;
    }
    if (this.userRole == 'User') {
      GlobalConstants.globalReadOnly = true;
      this.globalReadOnly = true;
    }
  }

  getRolePriority(userRole: string) {
    switch (userRole) {
      case 'User': {
        this.userChecked = true;
        break;
      }
      case 'Superuser': {
        this.superUserChecked = true;
        break;
      }
      case 'Administrator': {
        this.adminChecked = true;
        break;
      }
      case 'Ishida': {
        this.ishidaChecked = true;
        break;
      }

      default: {
        this.userChecked = false;
        this.superUserChecked = false;
        this.adminChecked = false;
        this.ishidaChecked = false;
        break;
      }
    }
  }



  userregisRouterInit() {
    this.router.navigate(['ii/usermanagement']);
  }

  logsRouterInit(){
    this.router.navigate(['ii/indentlogs']);
  }

  logoutRouterInit() {
    this.updateUserLoginStatus();
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['']);
    this.commonService.toast("success", "Logout Successfully.");
  }

  updateUserLoginStatus() {
    let url = GlobalConstants.apiUpdateLoginStatus;
    let userid = sessionStorage.getItem('userid');
    const param = new HttpParams()
      .set('LOGIN_STATUS', '0')
      .set('USER_ID', userid);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const options = { headers };
    this.httpcon.post<any[]>(url, param, options).subscribe(res => {
      if (res['affectedRows'] == 1) {
      }
    }, () => {
    });

  }

  //Change User Password
  chnageUserPassword(changeUserPassword) {
    Swal.close();
    this.changePasswordForm.reset();
    this.modalReference = this.modalService.open(changeUserPassword, { backdrop: 'static', keyboard: false, size: 'md', backdropClass: 'light-blue-backdrop', centered: true });
  }


  // ---------------------------------------------Change Password Modal Code start here-----------------------------------
  // password eye slash toggle. 
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleCurrFieldTextType() {
    this.currPassFieldType = !this.currPassFieldType;
  }
  toggleNewFieldTextType() {
    this.newPassFieldType = !this.newPassFieldType;
  }
  toggleConfFieldTextType() {
    this.confPassFieldType = !this.confPassFieldType;
  }

  textBox_KeyUp(evt) {
    if (evt.target) {
      this.isCurrPassMatched = true;
    }
  }

  changePassword() {
    const key = 'mysecretkey12345';
    this.isPassChange = true;
    this.isCurrPassMatched = false;
    // this.currPassword = sessionStorage.getItem('password');
    this.currPassword = GlobalConstants.glabalUserLoginPass;
    // if (this.currPassword != this.changePasswordForm.value.curr_password.trim()) {
    //   return;
    // }
    if (this.changePasswordForm.value.new_password.trim() === this.changePasswordForm.value.curr_password.trim()) {
      return;
    }
    if (this.changePasswordForm.invalid) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const param = new HttpParams()
      .set('USER_ID', this.encdec.set(key, sessionStorage.getItem('userid')))
      .set('CURR_PASSWORD', this.encdec.set(key, this.changePasswordForm.value.curr_password.trim()))
      .set('PASSWORD', this.encdec.set(key, this.changePasswordForm.value.new_password.trim()));

    const options = { headers };
    this.httpcon.post<any>(GlobalConstants.apiChangePassword, param, options).subscribe(res => {
      if (res['affectedRows'] == 1) {
        this.isCurrPassMatched = true;
        this.modalReference.close();
        this.commonService.toast("success", "Password changed successfully, Please login...");
        this.router.navigate(['']);
        sessionStorage.clear();
      }
      else if (res['affectedRows'] == 0 && res['message'] === 'Password not matched.') {
        this.isCurrPassMatched = false;
      }
      else {
        this.commonService.toast("error", "There is some error while updating.")
      }
    })
  }

}

