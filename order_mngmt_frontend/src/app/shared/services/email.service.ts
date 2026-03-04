import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SegmapEmails } from './indentdb.type';
import { GlobalConstants } from '../common/global-constants';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  addEmail(email_id: string): Observable<void> {

    let url = GlobalConstants.apiAddEmail;
    const param = new HttpParams()
      .set('email_id', email_id);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const options = { headers };
    return this.http.post<void>(url, param, options).pipe(map(Response => {

      var serverResponse = Response;
      let affectedRows = serverResponse["affectedRows"];

      let message2 = 'Failed to add email.';
      let message = 'Email <br>"' + email_id + '"<br> has been added successfully';

      if (affectedRows == 1) {
        this.swal(message)
      } else {
        this.swalError(message2);
      }
    }));
  }

  getEmailList() {
    let url = GlobalConstants.apiEmail;
    return this.http.get<SegmapEmails[]>(url);
  }

  getEmailData(id: string) {
    let url = GlobalConstants.apiEmailData;
    const param = new HttpParams()
      .set('id', id)
    return this.http.get<any[]>(url, { params: param });
  }

  async saveEmail(toCheckedEmails: any[], ccCheckedEmails: any[], id: string): Promise<Observable<void>> {
    return this.http.post<void>(`${GlobalConstants.apiAutomaticSendMail}/save_email`, { emails: toCheckedEmails, ccmail: ccCheckedEmails, id: id }).pipe(map(Response => {

      var serverResponse = Response;
      let affectedRows = serverResponse["affectedRows"];
      let message = '';

      if (id === '1') {
        message = 'II-EXF mail setting has <br> been saved successfully.';
      } else if (id === '2') {
        message = 'INV/eWB mail setting has <br> been saved successfully.';
      }
      let message2 = 'Failed to save Email setting.';

      if (affectedRows == 1) {
        this.swal(message)
      } else {
        this.swalError(message2);
      }
    }));
  }

  deleteEmail(email_id_num: string) {
    let url = GlobalConstants.apiDeleteEmail;
    const param = new HttpParams()
      .set('email_id_num', email_id_num)
    return this.http.delete<any[]>(url, { params: param }).pipe(map(Response => {

      var serverResponse = Response;
      let affectedRows = serverResponse["affectedRows"];

      let message2 = 'Failed to Delete the email.';
      let message = 'Deleted Successfully.';

      if (affectedRows > 0) {
        this.swal(message)
      } else {
        this.swalError(message2);
      }
    }));
  }

  updateEmail(emailId: string, updatedEmail: string) {

    let url = GlobalConstants.apiUpdateEmail;
    const body = { emailId, updatedEmail };
    return this.http.put<any[]>(url, body).pipe((map(Response => {

      var serverResponse = Response;
      let affectedRows = serverResponse["affectedRows"];

      let message2 = 'Failed to update email.';
      let message = 'Email <br>"' + updatedEmail + '"<br> has been updated successfully';

      if (affectedRows == 1) {
        this.swal(message)
      } else {
        this.swalError(message2);
      }
    })));
  }

  getRegionEmailList() {
    let url = GlobalConstants.apiRegionEmail;
    return this.http.get<any[]>(url);
  }

  addEmailRegion(newRegion: string): Observable<void> {
    let url = GlobalConstants.apiAddRegion;
    const param = new HttpParams()
      .set('region', newRegion);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const options = { headers };
    return this.http.post<void>(url, param, options).pipe(map(Response => {

      var serverResponse = Response;
      let affectedRows = serverResponse["affectedRows"];

      let message2 = 'Failed to add region.';
      let message = 'Region <br>"' + newRegion + '"<br> has been added successfully';

      if (affectedRows == 1) {
        this.swal(message)
      } else {
        this.swalError(message2);
      }
    }));
  }




  swal(message) {
    Swal.fire({
      title: message,
      icon: 'success',
      text: '',
      confirmButtonColor: '#282E89',
      width: 'auto',
      heightAuto: true,
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'rounded-0',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });

  }

  swalError(message) {
    Swal.fire({
      title: message,
      icon: 'warning',
      text: '',
      confirmButtonColor: '#282E89',
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'rounded-0',
      },
    })

  }







}
