import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';
import { GlobalConstants } from '../shared/common/global-constants';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';
import { EncryptionService } from '../services/encryption.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgbTooltip],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!: FormGroup;
  signupForm!: FormGroup;
  forgotPassword!: FormGroup;
  forgotPassEmail!: FormGroup;
  response: string = "";
  error = '';
  userID: string | null = null;

  resetUserID: string = "";
  login: boolean = true;
  checkPassword: boolean = true;
  checkPassword1: boolean = true;
  signUptext: boolean = false;
  setNewPasswordtext: boolean = false;
  resetUrl: string | null = null;

  emailAddress: string = "";

  @ViewChild('triggerModal', { static: false }) triggerModal!: ElementRef;
  // password = '';
  // newPassword = '';
  // reTypePassword = '';

  globalRequiredMsg: string = '';

  constructor(private router: Router, private fb: FormBuilder, private httpcon: HttpClient, private encdec: EncryptionService, private authService: AuthService, private route: ActivatedRoute, private modalService: NgbModal) {

    this.loginForm = this.fb.group({
      userId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, this.passwordValidator])
    });

    this.signupForm = this.fb.group({
      signupUserId: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, this.passwordValidator]),
      reTypePassword: new FormControl('', [Validators.required])
    });


    this.forgotPassword = this.fb.group({
      tempPassword: new FormControl('', [Validators.required]),
      newPassword2: new FormControl('', [Validators.required, this.passwordValidator]),
      reTypePassword2: new FormControl('', [Validators.required])
    });

    this.forgotPassEmail = this.fb.group({
      registeredEmail: new FormControl('', [Validators.required, Validators.email])
    });

  }

  token: string | null = null;
  empID: string = "";

  ngOnInit(): void {

    this.globalRequiredMsg = GlobalConstants.globalRequiredMsg;

    const key = 'mysecretkey12345';

    // this.token = this.route.snapshot.queryParamMap.get('token');
    // this.userID = this.route.snapshot.queryParamMap.get('empId');
    // this.resetUrl = this.route.snapshot.queryParamMap.get('reset');

    // if (this.userID) {
    //   this.userID = this.encdec.get(key, this.userID);

    //   this.empID = this.userID;
    // }


    // if (this.token) {
    //   this.authService.validateToken(this.token).subscribe(
    //     (response: any) => {
    //       if (response.status === "valid") {
    //         console.log('Token is valid');

    //         this.login = false;

    //         if (this.resetUrl == "password") {
    //           this.setNewPasswordtext = true;
    //           this.signUptext = false;
    //         } else {
    //           this.setNewPasswordtext = false;
    //           this.signUptext = true;
    //         }

    //       } else {
    //         console.log('Link is invalid or expired');

    //         this.login = true;
    //         alert("Link is invalid or expired. Redirecting to login page!")
    //         setTimeout(() => this.router.navigate(['/login']), 3000);
    //       }
    //     },
    //     (error) => {
    //       console.log('Link validation failed', error);

    //       this.login = true;
    //       alert("Link validation failed. Redirecting to login page!")
    //       setTimeout(() => this.router.navigate(['/login']), 3000);
    //     }
    //   );
    // }
    // else {
    //   this.login = true;
    //   setTimeout(() => this.router.navigate(['/login']), 3000);
    // }


    // this.userID = this.route.snapshot.paramMap.get('id')!;
    // if (this.userID == null) {
    //   this.login = true;
    // }

    // console.log(this.userID)

    // const authenticate = sessionStorage.getItem('auth');
    // if (authenticate == "true") {
    //   this.router.navigate(['/ii/my-view/home']); // Redirect to the Home if logged in
    // }
  }

  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.forgotPassEmail.reset();
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';

    if (!value.match(/[A-Z]/)) {
      return { upperCaseRequired: true };
    }
    if (!value.match(/[a-z]/)) {
      return { lowerCaseRequired: true };
    }
    if (!value.match(/[0-9]/)) {
      return { numberRequired: true };
    }
    if (!value.match(/[@$!%*?&#]/)) {
      return { specialCharacterRequired: true };
    }
    if (value.length < 8) {
      return { minLength: true };
    }
    if (value.length > 16) {
      return { maxLength: true };
    }
    if (!value) {
      return { required: true };
    }

    return null;
  }

  generatePasswordTooltip(form: FormGroup, controlName: string): string {
    const errors = form.get(controlName)?.errors;
    if (!errors) return '';
  
    const messages: string[] = [];
  
    if (errors['required']) {
      return this.globalRequiredMsg; 
    }
    if (errors['upperCaseRequired']) {
      messages.push('Password must contain at least one uppercase letter.');
    }
    if (errors['lowerCaseRequired']) {
      messages.push('Password must contain at least one lowercase letter.');
    }
    if (errors['numberRequired']) {
      messages.push('Password must contain at least one number.');
    }
    if (errors['specialCharacterRequired']) {
      messages.push('Password must contain at least one special character.');
    }
    if (errors['minLength']) {
      messages.push('Password must be at least 8 characters.');
    }
    if (errors['maxLength']) {
      messages.push('Password must be at most 16 characters.');
    }
  
    return messages.join('\n'); // Combine all messages into a single string
  }

  loginApp() {
    const userId = this.loginForm.get('userId')?.value;
    const password = this.loginForm.get('password')?.value;

    console.log(userId, password)

    this.authService.login(userId, password).subscribe(
      (data: string) => {
        this.response = data;

        if (this.response == "Login Successful") {
          console.log("successsss", this.response)
          sessionStorage.setItem("auth", "true");
          sessionStorage.setItem("userId", userId);
          this.router.navigate([`/ii/my-view/home`]);
        }
      },
      (error) => {
        this.error = 'Invalid username or password';
        alert(this.error);
      }
    );
  }

  confirmPassword() {

    if (this.signupForm.get('newPassword')?.value != this.signupForm.get('reTypePassword')?.value) {
      this.signupForm.setErrors({ invalid: true });
      this.checkPassword1 = false;

    } else {
      this.checkPassword1 = true;
    }

    if (this.forgotPassword.get('newPassword2')?.value != this.forgotPassword.get('reTypePassword2')?.value) {
      this.forgotPassword.setErrors({ invalid: true });
      this.checkPassword = false;

    } else {
      this.checkPassword = true;
    }

    if (this.checkPassword == false) {
      this.forgotPassword.setErrors({ invalid: true });
    }

  }

  async signUpApp() {
    const userId = this.signupForm.get('signupUserId')?.value;
    const newPassword = this.signupForm.get('newPassword')?.value;

    console.log(userId, newPassword, this.userID)
    const options = { withCredentials: true };
    let url: string;
    url = GlobalConstants.apiSignUp;

    if (this.empID == userId) {

      await this.httpcon.post<any>(url, { userId: userId, newPassword: newPassword, token: this.token, type: this.resetUrl })
        .pipe(map(Response => {

          console.log(Response)

          const defaultPassword = newPassword.slice(6);

          if (Response.affectedRows == 1) {

            this.authService.login(userId, defaultPassword).subscribe(
              (data: string) => {

                console.log(userId, newPassword)
                this.response = data;

                if (this.response == "Login Successful") {
                  console.log("successsss", this.response)

                  sessionStorage.setItem("auth", "true");
                  this.router.navigate([`/ii/my-view/home`]);
                }
              },
              (error) => {
                this.error = 'Invalid username or password';
              }
            );

          }
          // window.location.reload();
        }))
        .subscribe(() => { }, () => {
        });

    } else {
      alert("Link authentication Failed!");
    }


  }


  async getNewPassword() {

    console.log(this.emailAddress)
    const registeredEmail = this.forgotPassEmail.get('registeredEmail')?.value;

    const options = { withCredentials: true };
    let url: string;
    url = GlobalConstants.apiforgotPassword;

    await this.httpcon.post<any>(url, { emailAddress: registeredEmail })
      .pipe(map(Response => {

        console.log(Response)

        if (Response == 0) {
          alert("This user in not registered with us.")
        } else {
          // const empId = Response[0].username;
          // this.resetUserID = empId;
          // console.log(empId)
          alert("An Email with Reset Link has been sent to your email address.")
          // this.openResetPasswordModal(empId);
        }
      }))
      .subscribe(() => { }, () => {
      });

    this.closeModal();
  }

  // openResetPasswordModal(empId: string) {
  //   this.resetUserID = empId; // Assign user ID

  //   if (this.triggerModal) {
  //     this.triggerModal.nativeElement.click();
  //   }

  //   this.openModal();
  // }

  async setNewPassword() {

    const tempPass = this.forgotPassword.get('tempPassword')?.value;
    const newPassword = this.forgotPassword.get('newPassword2')?.value;

    let url: string;
    url = GlobalConstants.apiSetNewPassword;


    await this.httpcon.post<any>(url, { tempPassword: tempPass, newPassword: newPassword })
      .pipe(map(Response => {

        console.log(Response)

        if (Response.affectedRows == 1) {
          alert("Password is updated successfully");
        }

        // window.location.reload();
      }))
      .subscribe(() => { }, () => {
      });

    this.closeModal();

  }



  disableInspect(event: KeyboardEvent): boolean {
    if (
      event.ctrlKey &&
      (event.key === 'u' || event.key === 'U' ||
        event.key === 'i' || event.key === 'I' ||
        event.key === 'j' || event.key === 'J')
    ) {
      event.preventDefault();
      return false;
    }
    return true; // Ensure all code paths return a value
  }



}
