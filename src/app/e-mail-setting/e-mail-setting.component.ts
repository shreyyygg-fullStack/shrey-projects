import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SegmapEmailData, SegmapEmails } from '../shared/services/indentdb.type';
import { EmailService } from '../shared/services/email.service';
import { GlobalConstants } from '../shared/common/global-constants';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-e-mail-setting',
  templateUrl: './e-mail-setting.component.html',
  styleUrls: ['./e-mail-setting.component.css']
})
export class EMailSettingComponent implements OnInit {

  emailForm: FormGroup;
  addEmailForm: FormGroup;
  updateEmailForm: FormGroup;

  emailFormData: SegmapEmailData[] = [];
  globalInvalidDomainMsg: string = "Email domain should be within ISHIDA";

  selectedSetting: "Setting 1" | "Setting 2" | "Setting 3" | "Setting 4" | "Setting 5" = "Setting 1";
  listView: "To" | "CC" = "To";

  toemailsData: SegmapEmails[] = [];
  ccemailsData: SegmapEmails[] = [];

  subjectData: string;
  bodyData: string;
  eFlag: boolean;
  bodyNote: string = "";
  bodyMsg: string = "";

  setting_1Emails: any;

  ccEmails: any;
  existingEmails: string[] = [];

  selected = 0;
  ccSelected = 0;

  selectedEmail = 0;
  selectedString: string;
  ccselectedString: string;

  selectedItem: any;
  emailPattern = "^[a-zA-Z0-9._%+-]+@[ishida][a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$";
  emailMaxLength: number = 100;
  globalInvalidEmailMsg: string;

  constructor(private ngxService: NgxUiLoaderService, private Emailservice: EmailService, private modalService: NgbModal, private router: Router, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.ngxService.start();

    this.emailForm = new FormGroup({
      subject: new FormControl('', [Validators.required]),
      body: new FormControl('')
    });

    this.addEmailForm = new FormGroup({
      newEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern), this.emailDomainValidator('ishida')])
    });

    this.updateEmailForm = new FormGroup({
      updatedEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern), this.emailDomainValidator('ishida')])
    });

    this.inItdata();

    this.ngxService.stop();
  }

  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

  emailRouterInit() {
    location.reload();
  }

  async inItdata() {
    this.globalInvalidDomainMsg;
    this.globalInvalidEmailMsg = GlobalConstants.globalInvalidEmailMsg;

    // await this.getEmailList("1");
    // await this.getsavedEmailData("1");
    this.onClickSelectedSetting('Setting 1');

  }


  // Getting email list 
  async getEmailList(settingNum: string) {

    if (settingNum === "1") {

      let asyncResult = await this.Emailservice.getEmailList().toPromise();

      this.toemailsData = asyncResult;

      this.setting_1Emails = this.toemailsData.filter(item => item.setting_1);

      this.toemailsData.forEach(email => {
        email.checked = this.setting_1Emails.some(data => data.email === email.email)
      })

      let asyncResult2 = await this.Emailservice.getEmailList().toPromise();
      this.ccemailsData = asyncResult2;

      this.ccEmails = this.ccemailsData.filter(item => item.cc);

      this.ccemailsData.forEach(email => {
        email.checked = this.ccEmails.some(data => data.email === email.email)
      })

      this.selectedemail();
      this.selectedCCemail();

      return;
    }
    else if (settingNum === "2") {

      let asyncResult = await this.Emailservice.getEmailList().toPromise();

      this.toemailsData = asyncResult;

      this.setting_1Emails = this.toemailsData.filter(item => item.setting_2);

      this.toemailsData.forEach(email => {
        email.checked = this.setting_1Emails.some(data => data.email === email.email)
      })

      let asyncResult2 = await this.Emailservice.getEmailList().toPromise();
      this.ccemailsData = asyncResult2;

      this.ccEmails = this.ccemailsData.filter(item => item.cc_2);

      this.ccemailsData.forEach(email => {
        email.checked = this.ccEmails.some(data => data.email === email.email)
      })

      this.selectedemail();
      this.selectedCCemail();

      return;
    }
    else if (settingNum === "3") {
      return;
    }
    else if (settingNum === "4") {
      return;
    }
    else if (settingNum === "5") {
      return;
    }


  }

  // selected to email input display
  selectedemail() {
    this.selected = this.toemailsData.filter(data => data.checked).length;
    this.selectedString = `${this.selected} e-mail selected.`;
  }


  // selected cc email input display
  selectedCCemail() {
    this.ccSelected = this.ccemailsData.filter(data => data.checked).length;
    this.ccselectedString = `${this.ccSelected} e-mail selected.`;
  }


  // Getting email form data 
  async getsavedEmailData(id: string) {

    let asyncResult = await this.Emailservice.getEmailData(id).toPromise();
    this.emailFormData = asyncResult;
    
    this.subjectData = (this.emailFormData.map(item => item.subject)).toString();
    this.bodyData = (this.emailFormData.map(item => item.body)).toString();

    const bodyLength = this.bodyData.length;

    this.bodyNote = this.bodyData.substring(bodyLength - 60);
    this.bodyMsg = this.bodyData.substring(0, bodyLength - 60);
    this.eFlag = this.emailFormData[0].email_flag;

    if (this.eFlag) {
      document.querySelector('.on-off-button.on').classList.add('active');
      document.querySelector('.on-off-button.off').classList.remove('active');
    } else {
      document.querySelector('.on-off-button.off').classList.add('active');
      document.querySelector('.on-off-button.on').classList.remove('active');
    }
  }


  //To add email in the email list
  async addEmail() {

    const email_id = this.addEmailForm.get('newEmail').value;
    this.existingEmails = this.toemailsData.map(item => item.email);

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

  //Saving the email form 
  async saveMailSetting(id: string) {

    if (this.emailForm.valid) {

      const ccCheckedEmails = this.ccemailsData.filter((email) => email.checked)
        .map((email) => email.email);

      const checkedEmails = this.toemailsData.filter((email) => email.checked);

      const toCheckedEmails = checkedEmails.map(item => item.email);

      var emailBody = this.emailForm.get('body').value + this.bodyNote;

      const emailRequest = { subject: this.emailForm.get('subject').value, body: emailBody, email_flag: this.eFlag, id: id };

      return this.http.post<void>(`${GlobalConstants.apiAutomaticSendMail}/save`, emailRequest).pipe(map(async Response => {

        var serverResponse = Response;
        let affectedRows = serverResponse["affectedRows"];
        let message = 'Failed to save Email setting.';

        if (affectedRows === 1) {

          (await this.Emailservice.saveEmail(toCheckedEmails, ccCheckedEmails, id)).subscribe(
            () => { }
          );
        } else {
          this.swalError(message);
        }
      })).subscribe();
    }
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

  // To trigger the update email modal
  viewUpdateModal(content, email) {
    this.selectedItem = { ...email };
    this.modalService.open(content, { size: 'md', centered: true, backdrop: 'static', keyboard: false });
  }

  //to close the modal
  closeModal() {
    this.modalService.dismissAll();
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
    this.existingEmails = this.toemailsData.map(item => item.email);

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

  // Selection of Setting buttons
  onClickSelectedSetting(type: "Setting 1" | "Setting 2" | "Setting 3" | "Setting 4" | "Setting 5") {
    this.selectedSetting = type;

    if (this.selectedSetting === "Setting 1") {
      this.getsavedEmailData("1");
      this.getEmailList("1");
      return;
    }
    else if (this.selectedSetting === "Setting 2") {
      this.getsavedEmailData("2");
      this.getEmailList("2");
      return;
    }
    else if (this.selectedSetting === "Setting 3") {
      this.getsavedEmailData("3");
      return;
    }
    else if (this.selectedSetting === "Setting 4") {
      this.getsavedEmailData("4");
      return;
    }
    else if (this.selectedSetting === "Setting 5") {
      this.getsavedEmailData("5");
      return;
    }
  }

  closeAddEmail() {
    this.addEmailForm.get('newEmail').reset();
  }

  // List view for TO and CC
  onClicklist(type: "To" | "CC") {
    this.listView = type;
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

}
