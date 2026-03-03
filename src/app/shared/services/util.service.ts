import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../common/global-constants';
import { EncryptionService } from './encryption.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private router: Router, private http: HttpClient, private encdec: EncryptionService, private ngxService: NgxUiLoaderService) { }

  
  getDepartmentList() {
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    let url = GlobalConstants.apiGetDepartmentList;
    return this.http.get<any>(url, { headers });
  }
  getDesignationList() {
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    let url = GlobalConstants.apiGetDesignationList;
    return this.http.get<any>(url, { headers });
  }
  getUserRoleList() {
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    let url = GlobalConstants.apiGetUserRoleList;
    return this.http.get<any>(url, { headers });
  }
  
  getUserListWithEmail(email: string) {
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    let url = GlobalConstants.apiMatchUserWithEmail + email;
    return this.http.get<any>(url, { headers });
  }

  getApiForForgetPasswordMailSend(email: any, modalReference: NgbModalRef) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const param = new HttpParams()
      .set('EMAIL', email);

    const options = { headers };
    let url = GlobalConstants.apiForgetPasswordSendMail + email;
    this.ngxService.start();
    return this.http.post<any>(url, param, options).subscribe(res => {
      if (res['affectedRows'] == 1) {
        GlobalConstants.globalIsMailSentSuccessFully = true;
        sessionStorage.setItem('token', '');
        this.ngxService.stop();
        Swal.fire({
          title: 'New Password sent to your registered email id.',
          icon: 'success',
          text: '',
          confirmButtonColor: '#282E89',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            GlobalConstants.globalIsMailSentSuccessFully = false;
            modalReference.close();
          }
        });
      }
      else {
        this.ngxService.stop();
      }
    }, () => {
      this.ngxService.stop();
      this.SwalMsg('error', '', 'There is some problem while loading!!')
    });
  }







  SwalMsg(type: any, titletext: string, message: string) {
    Swal.close();
    Swal.fire({
      icon: type,
      title: titletext,
      text: message,
      confirmButtonColor: '#282E89',
      allowOutsideClick: false
    })
  }
}
