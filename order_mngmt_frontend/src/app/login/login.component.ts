import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { getUserLoginInfo, gethttpResponseError } from '../shared/services/indentdb.type';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../shared/common/global-constants';
import { CommonServiceService } from '../shared/services/common-service.service';
import { EncryptionService } from '../shared/services/encryption.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../shared/services/util.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgetUserPasswordForm: FormGroup;
  changePasswordForm: FormGroup;
  isSubmitted = false;
  successfulSave: boolean;
  userLogin: getUserLoginInfo[] = [];
  httpError: gethttpResponseError[] = [];   // never been used in login file
  fieldTextType: boolean;
  modalReference: NgbModalRef;
  passwordPattern = '^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^!&*+=]).*$' //"^(?=.*?[0-9])(?=.*?[#?!@$%^&*-])(?=.*?[A-Za-z]).{6,}$";  // password must have atleast 6 length and must include one number and one special character with 1 capital letter.
  @ViewChild('onChangePassword') onChangePassword: any;

  isPassReset: boolean = false;
  currPassword: any;
  currSessionPassword: any;
  tempPassword: string = null;
  currPassFieldType: boolean;
  newPassFieldType: boolean;
  confPassFieldType: boolean;
  globalIsMaintenanceEnable: boolean = false;

  // global variable
  globalRequiredMsg: string;
  globalInvalidEmailMsg: string;
  globalIncorrectPassMsg: string;
  globalDiffNewAndCurrentPassMsg: string;
  globalInvalidPasswordMsg: string;
  globalDiffPasswordMsg: string;

  constructor(private router: Router, private route: ActivatedRoute, private httpcon: HttpClient, private formBuilder: FormBuilder, private commonService: CommonServiceService, private encdec: EncryptionService, private modalService: NgbModal, private utilService: UtilService, private ngxService: NgxUiLoaderService) {
    this.forgetUserPasswordForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.changePasswordForm = this.formBuilder.group({
      curr_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
      confirm_password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
    },
      { validator: [this.matchPasswords, this.password.bind(this), this.MustMatch('new_password', 'confirm_password')] });
  }

  ngOnInit() {
    this.globalRequiredMsg = GlobalConstants.globalRequiredMsg;
    this.globalInvalidEmailMsg = GlobalConstants.globalInvalidEmailMsg;
    this.globalIncorrectPassMsg = GlobalConstants.globalIncorrectPassMsg;
    this.globalDiffNewAndCurrentPassMsg = GlobalConstants.globalDiffNewAndCurrentPassMsg;
    this.globalInvalidPasswordMsg = GlobalConstants.globalInvalidPasswordMsg;
    this.globalDiffPasswordMsg = GlobalConstants.globalDiffPasswordMsg;


    this.loginForm = this.formBuilder.group({
      user_id: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.globalIsMaintenanceEnable = GlobalConstants.globalIsMaintenanceEnable;
  }

  matchPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('new_password').value;
    let confirmPass = group.get('confirm_password').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('new_password');
    const { value: confirmPassword } = formGroup.get('confirm_password');
    return password === confirmPassword ? null : { passwordNotMatch: true };
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

  login() {
    Swal.close();
    const key = 'mysecretkey12345'
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const options = { headers };
    const param = new HttpParams()
      .set('user_id', this.encdec.set(key, this.loginForm.value.user_id.trim()))
      .set('password', this.encdec.set(key, this.loginForm.value.password.trim()));

    // sessionStorage.setItem('token', 'initiated');
    sessionStorage.setItem('token', 'initiated'+ this.encdec.set(key,'initiated') );
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.ngxService.start();
      this.httpcon.post<any>(GlobalConstants.apiAuthenticate, param, options).subscribe(res => {
        this.userLogin = res;
        sessionStorage.setItem('status', this.userLogin['status']);
        sessionStorage.setItem('token', this.userLogin['token']);
        sessionStorage.setItem('username', this.userLogin['userName']);
        sessionStorage.setItem('userid', this.userLogin['userID']);
        sessionStorage.setItem('role', this.userLogin['userRole']);
        sessionStorage.setItem('email', this.userLogin['email']);
        sessionStorage.setItem('department', this.userLogin['department']);
        sessionStorage.setItem('designation', this.userLogin['designation']);
        // sessionStorage.setItem('password', this.userLogin['password']);

        GlobalConstants.glabalUserLoginPass = this.userLogin['password'];

        if (this.userLogin['status'] === 'Failed') {
          sessionStorage.clear();
          this.successfulSave = false;
          this.ngxService.stop();
          this.commonService.toast("error", 'Invalid Credentials');
        }
        else if (this.userLogin['userActiveStatus'] != '1') {
          this.ngxService.stop();
          this.utilService.SwalMsg('info', 'Unauthorized User', 'Access Denied for ' + this.userLogin['userName'] + '. Please Contact Administrator.');
        }
        else if (this.userLogin['tempPassword'] != null) {
          this.tempPassword =  this.encdec.get(key,this.userLogin['tempPassword']);
          this.currPassword = this.loginForm.value.password.trim();
          this.currSessionPassword =  this.encdec.get(key, this.userLogin['password']);
          if (this.currPassword === this.tempPassword) {
            this.ngxService.stop();
            this.openChangePassword(this.onChangePassword);
          }
          else if (this.currPassword === this.currSessionPassword) {
            this.updateUserLoginStatus(this.userLogin);
            this.ngxService.stop();
            this.router.navigate(['ii/home']);
          }
        }
        else {
          this.updateUserLoginStatus(this.userLogin);
          this.ngxService.stop();
          this.router.navigate(['ii/home']);
        }
      }, () => {
        this.ngxService.stop();
        this.utilService.SwalMsg('error', '', 'There is some problem while loading!!')
      });
    }
  }

  changePassword() {
    this.isPassReset = true;
    if (this.tempPassword != this.changePasswordForm.value.curr_password.trim()) {
      return;
    }
    if (this.changePasswordForm.value.new_password.trim() === this.changePasswordForm.value.curr_password.trim()) {
      return;
    }
    if (this.changePasswordForm.invalid) {
      return;
    }
    const key = 'mysecretkey12345'

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const param = new HttpParams()
      .set('USER_ID', this.loginForm.value.user_id)
      .set('PASSWORD', this.encdec.set(key, this.changePasswordForm.value.new_password.trim()));

    const options = { headers };
    this.httpcon.post<any>(GlobalConstants.apiResetPassword, param, options).subscribe(res => {
      if (res['affectedRows'] == 1) {
        this.modalReference.close();
        this.commonService.toast("success", "Password changed successfully, Please login...");
        this.router.navigate(['']);
        sessionStorage.clear();
      }
      else {
        this.commonService.toast("error", "There is some error while updating.")
      }
    })
  }

  updateUserLoginStatus(userLogin) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const param = new HttpParams()
      .set('LOGIN_STATUS', '1')
      .set('USER_ID', userLogin['userID']);
    const options = { headers };
    let url = GlobalConstants.apiUpdateLoginStatus;
    this.httpcon.post<any>(url, param, options).subscribe(res => {
      if (res['affectedRows'] == 1) {
      }
    });
  }

  getNewPassword() {
    const key = 'mysecretkey12345';
    let email = this.forgetUserPasswordForm.value.email.trim();
    sessionStorage.setItem('token', 'initiated'+ this.encdec.set(key,'initiated') );
    this.utilService.getUserListWithEmail(email).subscribe(data => {
      if (data.length != 0) {
        this.utilService.getApiForForgetPasswordMailSend(email, this.modalReference);
      }
      else {
        this.utilService.SwalMsg('info', '', 'Email is not registered with us. Please use different.');
      }
    },
      () => {
        this.utilService.SwalMsg('error', 'Server Error', 'Server not connected. Unable to load data.');
        return;
      });
  }

  openforgetPassword(forgetUserPassword) {
    Swal.close();
    this.forgetUserPasswordForm.reset();
    this.openConfirmation(forgetUserPassword, 'lg');
  }

  openChangePassword(onChangePassword) {
    Swal.close();
    this.changePasswordForm.reset();
    if (this.userLogin['tempPassword'] != null) {
      this.openConfirmation(onChangePassword, 'md');
    }
  }

  openConfirmation(content, size) {
    this.modalReference = this.modalService.open(content, { backdrop: 'static', keyboard: false, size: size, backdropClass: 'light-blue-backdrop', centered: true });
  }

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
}
