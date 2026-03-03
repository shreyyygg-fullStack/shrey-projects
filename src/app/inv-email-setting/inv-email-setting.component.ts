import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmapEmails } from '../shared/services/indentdb.type';
import { EmailService } from '../shared/services/email.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalConstants } from '../shared/common/global-constants';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-inv-email-setting',
  templateUrl: './inv-email-setting.component.html',
  styleUrls: ['./inv-email-setting.component.css']
})
export class InvEmailSettingComponent implements OnInit {

  addEmailForm: FormGroup;
  updateEmailForm: FormGroup;

  emailPattern = "^[a-zA-Z0-9._%+-]+@[ishida][a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$";
  emailMaxLength: number = 100;
  globalInvalidEmailMsg: string;
  globalInvalidDomainMsg: string;
  newRegion: string;
  searchText: string = '';
  eFlag: boolean;
  existingEmails: string[] = [];
  registeredEmails: SegmapEmails[] = [];
  filterregisteredEmails: SegmapEmails[] = [];
  selectedEmails: any[] = [];

  regionEmailData: any[] = [];
  regions: any[] = [];
  selectedCity: string | null = null;
  selectedItem: any;
  selectedEmailString: string;

  constructor(private router: Router, private ngxService: NgxUiLoaderService, private Emailservice: EmailService, private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.ngxService.start();

    this.globalInvalidDomainMsg = "Email domain should be within ISHIDA";
    this.globalInvalidEmailMsg = GlobalConstants.globalInvalidEmailMsg;

    this.addEmailForm = new FormGroup({
      newEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern), this.emailDomainValidator('ishida')])
    });

    this.updateEmailForm = new FormGroup({
      updatedEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern), this.emailDomainValidator('ishida')])
    });

    this.getEmailList();
    this.getRegionEmails();
    this.getEmailFlag2();

    this.ngxService.stop();
  }

  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

  invEmailRouterInit() {
    location.reload();
  }

  toggleState() {
    this.eFlag = !this.eFlag;

    const buttons = document.querySelectorAll('.on-off-button');
    buttons.forEach(button => button.classList.remove('active'));

    if (this.eFlag) {
      document.querySelector('.on-off-button.on').classList.add('active');

    } else {
      document.querySelector('.on-off-button.off').classList.add('active');
    }
  }

  //To add email in the email list
  async addEmail() {

    const email_id = this.addEmailForm.get('newEmail').value;
    this.existingEmails = this.registeredEmails.map(item => item.email);

    if (this.addEmailForm.valid) {
      if (this.existingEmails.some(r => r.toLowerCase() === email_id.toLowerCase())) {
        const message = "This E-mail already exists.";
        this.swalError(message);
        this.addEmailForm.get('newEmail').reset();
      }
      else {
        this.Emailservice.addEmail(email_id).subscribe(
          () => { }
        );
      }
    }
  }

  closeAddEmail() {
    this.addEmailForm.get('newEmail').reset();
  }

  // validation for email
  emailDomainValidator(requiredDomain) {
    return function (control: FormControl) {
      let email = control.value;
      let patternError = control.errors?.pattern;
      if (email && email.indexOf("@") != -1) {
        let [_, domain] = email.split("@");
        if (domain.indexOf(requiredDomain) === -1) {
          return {
            emailDomain: {
              valid: false,
              parsedDomain: domain
            }
          }
        }
      }
      if (patternError) {
        return;
      }
      return null;
    }
  }

  // Getting email list 
  async getEmailList() {

    let asyncResult = await this.Emailservice.getEmailList().toPromise();

    this.registeredEmails = asyncResult;
    this.filterregisteredEmails = asyncResult;

  }


  // Getting region email data 
  async getRegionEmails() {

    let asyncResult = await this.Emailservice.getRegionEmailList().toPromise();

    this.regionEmailData = asyncResult;

    this.regions = this.regionEmailData.map(item => item.region);

    if (this.regionEmailData.length > 0) {
      this.selectCity(this.regionEmailData[0].region);
    }
  }

  selectCity(city: string) {
    this.selectedCity = city;

    this.selectedEmails = this.regionEmailData.reduce((acc: string[], file) => {
      if (file.region === city && file.emails) {
        const emailList = file.emails.split(',').map(e => e.trim());
        acc.push(...emailList);
      }
      return acc;
    }, []);

    this.selectedEmailString = this.regionEmailData.find(file => file.region === city)?.emails || '';
  }

  onSelect(email: any) {

    if (!this.selectedEmails.includes(email)) {
      this.selectedEmails.push(email);
      this.selectedEmailString = this.selectedEmails.join(', ');
    }
  }

  removeEmail(email) {
    const index = this.selectedEmails.indexOf(email);

    this.selectedEmails.splice(index, 1);
    this.selectedEmailString = this.selectedEmails.join(', ');
  }

  // To delete an Email
  deleteEmail(email) {

    const email_id_num = this.selectedItem.id_num;
    this.Emailservice.deleteEmail(email_id_num.toString()).subscribe(
      () => { }
    );
  }

  onClickUpdateEmail() {
    this.updateEmail();
  }

  // To update the email
  updateEmail() {
    const updatedEmail = this.updateEmailForm.get('updatedEmail').value;
    this.existingEmails = this.registeredEmails.map(item => item.email);

    if (this.updateEmailForm.valid) {
      if (this.existingEmails.some(r => r.toLowerCase() === updatedEmail.toLowerCase())) {
        const message = "This E-mail already exists.";
        this.swalError(message);
      }
      else {
        const id_number = this.selectedItem.id_num;
        this.Emailservice.updateEmail(id_number.toString(), updatedEmail).subscribe(
          () => { }
        );
      }

    }
  }

  saveRegionEmails() {

    let flag;
    if (this.eFlag) {
      flag = "true";
    } else {
      flag = "false";
    }

    const emailRequest = { region: this.selectedCity, emails: this.selectedEmailString, email_flag: flag };

    return this.http.post<void>(`${GlobalConstants.apiAddRegionEmails}`, emailRequest).pipe(map(async Response => {

      var serverResponse = Response;
      let affectedRows = serverResponse["affectedRows"];
      let message = 'Failed to save INV Email Setting.';

      if (affectedRows === 1) {
        this.swal("INV Email Setting has been saved successfully.");
        this.getRegionEmails();
      } else {
        this.swalError(message);
      }
    })).subscribe();
  }

  async getEmailFlag2() {

    const url = GlobalConstants.apiGetEmailFlag2;
    this.http.get<any>(url).subscribe(res => {

      let email_flag = res.map(d => d.email_flag);

      this.eFlag = email_flag[0];

      if (this.eFlag == true) {

        document.querySelector('.on-off-button.on').classList.add('active');
        document.querySelector('.on-off-button.off').classList.remove('active');
      } else if (this.eFlag == false) {

        document.querySelector('.on-off-button.off').classList.add('active');
        document.querySelector('.on-off-button.on').classList.remove('active');
      }
    }, () => { });

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

  // To trigger the update email modal
  viewUpdateModal(content, email) {
    this.selectedItem = { ...email };
    this.modalService.open(content, { size: 'md', centered: true, backdrop: 'static', keyboard: false });
  }

  //to close the modal
  closeModal() {
    this.modalService.dismissAll();
  }

  //toast to delete email
  swalDelete(email) {

    this.selectedItem = { ...email };
    const email_id = this.selectedItem.email;

    Swal.fire({
      icon: 'question',
      title: 'Delete Email',
      text: 'Do you want to delete this Email: ' + email_id,
      showDenyButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
      confirmButtonColor: '#282E89',
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'swalConfirmButton rounded-0',
        denyButton: 'swalDenyButton rounded-0',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteEmail(this.selectedItem);
      }
    })
  }

  //Add Region method
  addRegion() {

    if (this.newRegion) {
      if (this.regions.some(r => r.toLowerCase() === this.newRegion.toLowerCase())) {
        this.swalError(`"${this.newRegion}" Region already exists!`);
        return;
      }

      Swal.fire({
        icon: 'question',
        title: 'Save Region',
        text: 'Do you want to add this Region: ' + this.newRegion,
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
        confirmButtonColor: '#282E89',
        allowOutsideClick: false,
        customClass: {
          confirmButton: 'swalConfirmButton rounded-0',
          denyButton: 'swalDenyButton rounded-0',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.Emailservice.addEmailRegion(this.newRegion).subscribe(
            () => { }
          );

        }
      })
    } else {
      this.swalError("Enter Any Region Name!");
    }
  }

  // method for search bar
  globalSearchKeyUp() {
    if (this.searchText.length === 0) {
      this.registeredEmails = this.filterregisteredEmails;
      return;
    }
    this.registeredEmails = this.filterregisteredEmails.filter(indent => {
      return Object.values(indent).some(value =>
        value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
      );
    });
  }


}

