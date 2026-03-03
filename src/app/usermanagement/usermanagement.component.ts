import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../shared/common/global-constants';
import { CommonServiceService } from '../shared/services/common-service.service';
import { EncryptionService } from '../shared/services/encryption.service';
import { getUserLoginInfo } from '../shared/services/indentdb.type';
import { UtilService } from '../shared/services/util.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})
export class UsermanagementComponent implements OnInit {

  addUserForm: FormGroup;
  updateUserForm: FormGroup;
  useridPattern = "^IIPL|iipl-[a-zA-Z0-9]{3}$";   // pattern   IIPL-XXX   OR iipl-xxx  where xxx can be 3 length string or number combination
  passwordPattern = '^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^!&*+=]).*$' //"^(?=.*?[0-9])(?=.*?[#?!@$%^&*-])(?=.*?[A-Za-z]).{6,}$";  // password must have atleast 6 length and must include one number and one special character with 1 capital letter.
  url: string;
  searchText: string = "";
  currentUser: number;
  activeUser: number;
  inActiveUser: number;
  enckey = 'mysecretkey12345';
  searchPlaceholder: string = "Search [ User ID, User Name, Email, Department, Designation, Role..]";
  ClickedRow: (index: any) => void;
  HighlightRow: Number;

  departmentList: any = [];
  userList: any[] = [];
  userDetails: any[] = [];
  modalReference: NgbModalRef;
  fieldTextType: boolean;
  deleteUserId: string;
  deleteUserName: any;
  timestampFormat: string = "YYYY-MM-DD hh:mm:ss";
  error_msg: string;
  designationList: any = [];
  userRoleList: any = [];
  userid: any;
  username: any;
  email: any;
  department: any;
  password: any;
  designation: any;
  role: any;
  activestatus: any;
  isDataChanged: boolean;
  selectedUserList: 'All'|'Active'|'Inactive' = 'All';
  // global variables
  globalRequiredMsg: string;
  globalIdPatternMsg: string;
  globalInvalidEmailMsg: string;
  globalPasswordMinLengthMsg: string;
  globalPasswordMaxLengthMsg: string;
  globalPasswordPatternMsg: string;

  //maxlength variables
  userIdMaxLength:number = 8;
  userNameMaxLength: number = 50;
  emailMaxLength: number = 50;
  passwordMaxLength: number= 20;
  passwordMinLength: number = 8;
  searchMaxLength: number = 50;

  emailPattern = "^[a-zA-Z0-9._%+-]+@[ishida][a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$";
  globalInvalidDomainMsg: string = "Email domain should be within ISHIDA";

  constructor(private modalService: NgbModal, private httpcon: HttpClient, private router: Router, private utilService: UtilService, private encdec: EncryptionService, private commonService: CommonServiceService) {
    this.ClickedRow = function (index) {
      this.HighlightRow = index;
    }
  }

  ngOnInit(): void {
    
    this.globalRequiredMsg = GlobalConstants.globalRequiredMsg;
    this.globalIdPatternMsg = GlobalConstants.globalIdPatternMsg;
    this.globalInvalidEmailMsg = GlobalConstants.globalInvalidEmailMsg;
    this.globalPasswordMinLengthMsg = GlobalConstants.globalPasswordMinLengthMsg;
    this.globalPasswordMaxLengthMsg = GlobalConstants.globalPasswordMaxLengthMsg;
    this.globalPasswordPatternMsg = GlobalConstants.globalPasswordPatternMsg;
    
    this.addUserForm = new FormGroup({
      userId: new FormControl('', [Validators.required, Validators.pattern(this.useridPattern)]),
      userName: new FormControl('', [Validators.required,]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern), this.emailDomainValidator('ishida')]),
      password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(8), Validators.pattern(this.passwordPattern)]),
      role: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required])
    });

    this.updateUserForm = new FormGroup({
      password: new FormControl('', [Validators.maxLength(20), Validators.minLength(8), Validators.pattern(this.passwordPattern)]),
      role: new FormControl('', [Validators.required]),
      activeStatus: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      userId: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
    });

    this.loadDefaultData();
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

  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

  userManagementRouterInit() {
    location.reload();
  }

  loadDefaultData() {
    this.addUserForm.reset();
    this.updateUserForm.reset();
    this.getUserList();
    this.getCurrentUserCount();
    this.getActiveUserCount();
    this.getInActiveUserCount();
  }

  getUserList() {
    this.searchText = "";
    this.selectedUserList='All';
    this.url = GlobalConstants.apiGetUserList;
    this.httpcon.get<getUserLoginInfo[]>(this.url).subscribe(res => {
      if (res.length != 0) {
        this.userList = res;
        this.userDetails = this.userList;
      }
    }, () => {
      this.utilService.SwalMsg('error', 'Server Error', 'Server not connected. Unable to load data.');
    });
  }

  getCurrentUserCount(): void {
    this.url = GlobalConstants.apiGetCurrentUserCount;
    this.httpcon.get<any[]>(this.url).subscribe(res => {
      this.currentUser = 0;
      if (res.length != 0) {
        this.currentUser = res[0].userCount;
      }
    }, () => {
      this.utilService.SwalMsg('error', 'Server Error', 'Server not connected. Unable to load data.');
    });
  }

  getActiveUserCount(): void {
    this.url = GlobalConstants.apiGetActiveUserCount;
    this.httpcon.get<any[]>(this.url).subscribe(res => {
      this.activeUser = 0;
      if (res.length != 0) {
        this.activeUser = res[0].userCount;
      }
    }, () => {
      this.utilService.SwalMsg('error', 'Server Error', 'Server not connected. Unable to load data.');
    });
  }

  getInActiveUserCount(): void {
    this.url = GlobalConstants.apiGetInActiveUserCount;
    this.httpcon.get<any[]>(this.url).subscribe(res => {
      this.inActiveUser = 0;
      if (res.length != 0) {
        this.inActiveUser = res[0].userCount;
      }
    }, () => {
      this.utilService.SwalMsg('error', 'Server Error', 'Server not connected. Unable to load data.');
    });
  }

  getActiveUserList() {
    this.selectedUserList='Active';
    this.searchText = "";
    this.url = GlobalConstants.apiGetActiveUserList;
    this.httpcon.get<getUserLoginInfo[]>(this.url).subscribe(res => {
      if (res.length != 0) {
        this.userList = res;
        this.userDetails = this.userList;
      }
    }, () => {
      this.utilService.SwalMsg('error', 'Server Error', 'Server not connected. Unable to load data.');
    });
  }

  getInActiveUserList() {
    this.selectedUserList='Inactive';
    this.searchText = "";
    this.url = GlobalConstants.apiGetInActiveUserList;
    this.httpcon.get<getUserLoginInfo[]>(this.url).subscribe(res => {
      if (res.length != 0) {
        this.userList = res;
        this.userDetails = this.userList;
      }
    }, () => {
      this.utilService.SwalMsg('error', 'Server Error', 'Server not connected. Unable to load data.');
    });
  }

  getDepartmentList() {
    this.utilService.getDepartmentList().subscribe(data => {
      this.departmentList = data;
    },
      () => {
        this.utilService.SwalMsg('error', 'Server Error', 'Server not connected. Unable to load data.');
      });
  }

  getDesignationList() {
    this.utilService.getDesignationList().subscribe(data => {
      this.designationList = data;
    },
      () => {
        this.utilService.SwalMsg('error', 'Server Error', 'Server not connected. Unable to load data.');
      });
  }

  getUserRoleList() {
    this.utilService.getUserRoleList().subscribe(data => {
      this.userRoleList = data;
    },
      () => {
        this.utilService.SwalMsg('error', 'Server Error', 'Server not connected. Unable to load data.');
      });
  }

  openConfirmation(content, size) {
    this.modalReference = this.modalService.open(content, { backdrop: 'static', keyboard: false, size: size, backdropClass: 'light-blue-backdrop', centered: true });
  }

  viewAddModal(content) {
    this.addUserForm.reset();
    this.getDepartmentList();
    this.getDesignationList();
    this.getUserRoleList();
    this.openConfirmation(content, 'lg');
  }

  viewUpdateModal(content, id: string) {
    this.getDepartmentList();
    this.getDesignationList();
    this.getUserRoleList(); 
    for (let user of this.userDetails) {
      if (user.USER_ID == id) {
        this.updateUserForm.patchValue({
          userId: user.USER_ID,
          userName: user.USER_NAME,
          email: user.EMAIL,
          department: user.DEPARTMENT,
          designation: user.DESIGNATION,
          role: user.USER_ROLE,
          password: null,
          activeStatus: user.ACTIVE_STATUS
        })

        this.userid = user.USER_ID;
        this.username = user.USER_NAME;
        this.email = user.EMAIL;
        this.department = user.DEPARTMENT;
        this.password = user.PASSWORD;
        this.role = user.USER_ROLE;
        this.activestatus = user.ACTIVE_STATUS;
        this.designation = user.DESIGNATION;
      }
    }
    this.openConfirmation(content, 'lg');
  }

  viewDeleteModal(id: string) {
    for (let user of this.userDetails) {
      if (user.USER_ID == id) {
        if (user.USER_ROLE == 'Administrator' || user.USER_ROLE == 'ADMINISTRATOR') {
          this.toast('warning', 'You Can Not Delete An Admin User');
        }
        else {
          this.deleteUserId = id;
          this.deleteUserName = user.USER_NAME;
          Swal.fire({
            icon: 'question',
            title: 'Delete User',
            text: 'Do you want to delete selected user: ' + this.deleteUserName,
            showDenyButton: true,
            confirmButtonText: `YES`,
            denyButtonText: `NO`,
            confirmButtonColor: '#282E89',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.delete();
            }
          })
        }
        break;
      }
    }
  }

  addUser() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    let userid = this.addUserForm.value.userId;
    userid = userid.toUpperCase();

    const param = new HttpParams()
      .set('USER_ID', userid)
      .set('USER_NAME', this.addUserForm.value.userName)
      .set('EMAIL', this.addUserForm.value.email)
      .set('PASSWORD', this.encdec.set(this.enckey, this.addUserForm.value.password.trim()))
      .set('USER_ROLE', this.addUserForm.value.role)
      .set('DEPARTMENT', this.addUserForm.value.department)
      .set('DESIGNATION', this.addUserForm.value.designation)
      .set('ACTIVE_STATUS', '1')
      .set('LOGIN_STATUS', '0')
      .set('CREATED_ON', moment().format(this.timestampFormat));

    const options = { headers };
    this.url = GlobalConstants.apiInsertUser;
    this.httpcon.post<any>(this.url, param, options).subscribe(res => {
      if (res['affectedRows'] == 1) {
        this.loadDefaultData();
        this.modalReference.close();
        this.utilService.SwalMsg('success', 'User added successfully', '');
        this.addUserForm.reset();
      }
      else {
        this.error_msg = "User_id already exists";
        this.toast("warning", "User ID already exists, please use another User ID")
        this.addUserForm.patchValue({ userId: '' });
      }
    });
  }

  update() {
    this.isDataChanged = false;
    let adminRoleChanged = false;
    if (this.updateUserForm.value.password != null) {
      if (this.password != this.updateUserForm.value.password) {
        this.isDataChanged = true;
      }
    }
    if (this.role != this.updateUserForm.value.role) {
      this.isDataChanged = true;
      if (GlobalConstants.globalUserRole == 'Administrator' || GlobalConstants.globalUserRole == 'Ishida') {
        if (sessionStorage.getItem('userid') === this.updateUserForm.value.userId) {
          adminRoleChanged = true;
        }
      }
    }
    if (this.activestatus != this.updateUserForm.value.activeStatus) {
      this.isDataChanged = true;
    }
    if (this.designation != this.updateUserForm.value.designation) {
      this.isDataChanged = true;
    }
    if (this.isDataChanged == false) {
      this.utilService.SwalMsg('info', '', 'Nothing to update.');
      return;
    }

    Swal.fire({
      icon: 'question',
      title: 'Update User Details',
      text: 'Do you want to update details for user: ' + this.username,
      showDenyButton: true,
      confirmButtonText: `YES`,
      denyButtonText: `NO`,
      allowOutsideClick: false,
      confirmButtonColor: '#282E89',
      denyButtonColor: '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        });
        let activeStatus;
        if (this.updateUserForm.value.activeStatus == true || this.updateUserForm.value.activeStatus == 'true') {
          activeStatus = '1';
        }
        if (this.updateUserForm.value.activeStatus == false || this.updateUserForm.value.activeStatus == 'false') {
          activeStatus = '0';
        }

        if (this.updateUserForm.value.password == null) {
          this.updateUserForm.value.password = this.encdec.set(this.enckey, this.encdec.get(this.enckey, this.password));
        }
        else {
          this.updateUserForm.value.password = this.encdec.set(this.enckey, this.updateUserForm.value.password.trim());
        }

        const param = new HttpParams()
          .set('USER_ID', this.updateUserForm.value.userId)
          .set('PASSWORD', this.updateUserForm.value.password)
          .set('USER_ROLE', this.updateUserForm.value.role)
          .set('DESIGNATION', this.updateUserForm.value.designation)
          .set('ACTIVE_STATUS', activeStatus)
          .set('LOGIN_STATUS', '1')
          .set('UPDATED_ON', moment().format(this.timestampFormat));

        const options = { headers };
        this.url = GlobalConstants.apiUpdateUser;
        this.httpcon.post<any>(this.url, param, options).subscribe(res => {
          if (res['affectedRows'] == 1) {
            this.modalReference.close();
            this.loadDefaultData();
            this.updateUserForm.reset();

            if (adminRoleChanged == true) {
              this.commonService.toast("success", "User Role Chnaged Successfully, Please Login...");
              this.router.navigate(['']);
              sessionStorage.clear();
              return;
            }
            
            this.utilService.SwalMsg('success', 'User Updated Successfully', '');
          }
          else {
            this.utilService.SwalMsg('error', 'There is some error while updating...', '');
            this.modalReference.close();
          }
        });
      }
    })
  }

  delete() {
    let currentUser = sessionStorage.getItem('userid');
    if (this.deleteUserId == currentUser) {
      this.utilService.SwalMsg('info', 'Abort Opetation', 'User" ' + this.deleteUserId + ', Cannot Delete Itself.');
      return;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const param = new HttpParams()
      .set('USER_ID', this.deleteUserId);
    const options = { headers };
    this.url = GlobalConstants.apiDeleteUser;
    this.httpcon.post<any>(this.url, param, options).subscribe(res => {
      if (res['affectedRows'] == 1) {
        this.utilService.SwalMsg('success', 'User Deleted Successfully!', '');
      }
      else {
        this.utilService.SwalMsg('error', 'There is some error while deletion!', '');
      }
      this.loadDefaultData();
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toast(type, message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: type,
      title: message
    })
  }
}
