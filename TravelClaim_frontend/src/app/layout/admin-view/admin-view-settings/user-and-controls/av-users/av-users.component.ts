import { NgFor, NgIf, NgClass } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { firstValueFrom, map } from 'rxjs';
import { EncryptionService } from '../../../../../services/encryption.service';
import { GlobalConstants } from '../../../../../shared/common/global-constants';
import { SettingsService } from '../../../../../services/settings.service';

@Component({
  selector: 'app-av-users',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './av-users.component.html',
  styleUrl: './av-users.component.scss'
})
export class AvUsersComponent {

  usersList: any[] | undefined;

  newUserModal: boolean = false;
  editUserModal: boolean = false;
  overviewUserModal: boolean = false;
  usersDetailsContainer: boolean = true;
  moreFilter: boolean = false;
  clickedFromButton: boolean = false;

  personalDetails: boolean = true;
  activityLog: boolean = false;

  userDetail: any[] = [];
  deleteResponse: any;
  isFormChanged: boolean = false;
  userDelete: any;
  deleteUserId: any;
  selectedEmpId: string | null = null;

  departmentList: any;
  designationList:any;
  locationList:any;
  emptStsList:any;
  designationNames: string[] = [];
  departmentNames: string[] = [];
  locationNames:string[]=[];
  emptStsNames:string[]=[];

  newUserForm: FormGroup;
  editUserForm: FormGroup;

  empId: string = "";
  firstName: string = "";
  middleName: string = "";
  lastName: string = "";
  emailAddress: string = "";
  mobileNo: string = "";
  empDesignation: string = "";
  empDepartment: string = "";
  reportingTo: string = "";
  empLocation: string = "";
  empDojDate: string = "";
  empStatus: string = "";


  filteredDepartments: string[] = []; // Filtered list
  filteredDesignations: string[] = [];
  filteredLocations:string[]=[];
  filteredEmptSts:string[]=[];
  searchTerm: string = ''; // Search input value
  desgSearchTerm:string = '';
  locationSearchTerm:string = '';
  emptStsSearchTerm:string = '';
  // searchTerm = signal('');
  selectedDepartment: string = ''; // Selected department
  selectedDesignation:string = '';
  selectedLocation:string = '';
  selectedEmptSts:string = '';

  constructor(private httpcli: HttpClient, private fb: FormBuilder, private encdec: EncryptionService,private settingService:SettingsService) {

    this.newUserForm = this.fb.group({
      empId: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl(''),
      lastName: new FormControl(''),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      mobileNo: new FormControl('', [Validators.required]),
      empDesignation: new FormControl('', [Validators.required]),
      empDepartment: new FormControl('', [Validators.required]),
      reportingTo: new FormControl('', [Validators.required]),
      empLocation: new FormControl('', [Validators.required]),
      empDojDate: new FormControl('', [Validators.required]),
      empStatus: new FormControl('', [Validators.required]),
    });


    this.editUserForm = this.fb.group({
      empId: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl(''),
      lastName: new FormControl(''),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      mobileNo: new FormControl('', [Validators.required]),
      // empDesignation: new FormControl('', [Validators.required]),
      // empDepartment: new FormControl('', [Validators.required]),
      reportingTo: new FormControl('', [Validators.required]),
      // empLocation: new FormControl('', [Validators.required]),
      empDojDate: new FormControl('', [Validators.required]),
      // empStatus: new FormControl('', [Validators.required]),
    });



    // effect(() => {
    //   // console.log('Data changed:', this.c());

    //   console.log('searchTerm Data changed:', this.searchTerm());

    //   // this.zipcode() === this.initialZipcodeValue() ? this.inputAlert = false : this.inputAlert = true

    // });

  }


  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }


  ngOnInit(): void {
    this.getUsersList();
  }


  personalDetailsTab() {
    this.personalDetails = true;
    this.activityLog = false;

  }

  activityLogTab() {
    this.personalDetails = false;
    this.activityLog = true;

  }

  editUserModalTrue() {
    this.editUserModal = !this.editUserModal;
    this.overviewUserModal = !this.overviewUserModal;

  }

  async getUsersList() {

    var url = GlobalConstants.apiGetUserList;
    let asyncResult = await firstValueFrom(this.httpcli.get<any[]>(url, { responseType: 'text' as 'json', withCredentials: true }));
    // this.usersList = asyncResult;

    if (asyncResult) {

      try {
        this.usersList = this.encdec.decodeData(asyncResult);

      } catch (error) {
        console.error('JSON Parsing Error:', error);

      }
    } else {
      console.error('No data received from the server');

    }

    console.log(this.usersList);
  }

  newUser() {
    this.newUserModal = true;
    this.usersDetailsContainer = false;
    this.editUserModal = false;
  }

  async editSelectedUser(users: any) {
    this.newUserModal = false;
    this.usersDetailsContainer = false;
    this.editUserModal = true;

    console.log(users.EMP_ID)

    const urllink = GlobalConstants.apiGetUserDetail + users.EMP_ID;

    await this.httpcli.get<any[]>(urllink, { responseType: 'text' as 'json', withCredentials: true })
      .pipe(map(Response => {
        // this.userDetail = Response;

        if (Response) {

          try {
            this.userDetail = this.encdec.decodeData(Response);

          } catch (error) {
            console.error('JSON Parsing Error:', error);

          }
        } else {
          console.error('No data received from the server');

        }

        this.empId = this.userDetail[0].EMP_ID;
        this.firstName = this.userDetail[0].FIRST_NAME;
        this.middleName = this.userDetail[0].MIDDLE_NAME;
        this.lastName = this.userDetail[0].LAST_NAME;
        this.emailAddress = this.userDetail[0].EMAIL_ADDRESS;
        this.mobileNo = this.userDetail[0].MOBILE_NO;
        this.selectedDesignation = this.userDetail[0].EMP_DESIGNATION;
        this.selectedDepartment = this.userDetail[0].EMP_DEPARTMENT;
        this.reportingTo = this.userDetail[0].REPORTING_TO;
        this.selectedLocation = this.userDetail[0].EMP_LOCATION;
        this.empDojDate = this.userDetail[0].EMP_DOJ_DATE;
        this.selectedEmptSts = this.userDetail[0].EMP_STATUS;

        // console.log("user detail", Response)

      }))
      .subscribe();

  }

  async overviewSelectedUser(users: any) {
    this.newUserModal = false;
    this.usersDetailsContainer = false;
    this.editUserModal = false;
    this.overviewUserModal = true;

    console.log(users.EMP_ID)

    const urllink = GlobalConstants.apiGetUserDetail + users.EMP_ID;

    await this.httpcli.get<any[]>(urllink, { responseType: 'text' as 'json', withCredentials: true })
      .pipe(map(Response => {
        this.userDetail = Response;

        if (Response) {
          try {
            this.userDetail = this.encdec.decodeData(Response);
          } catch (error) {
            console.error('JSON Parsing Error:', error);
          }
        } else {
          console.error('No data received from the server');
        }

        this.empId = this.userDetail[0].EMP_ID;
        this.firstName = this.userDetail[0].FIRST_NAME;
        this.middleName = this.userDetail[0].MIDDLE_NAME;
        this.lastName = this.userDetail[0].LAST_NAME;
        this.emailAddress = this.userDetail[0].EMAIL_ADDRESS;
        this.mobileNo = this.userDetail[0].MOBILE_NO;
        this.selectedDesignation = this.userDetail[0].EMP_DESIGNATION;
        this.selectedDepartment = this.userDetail[0].EMP_DEPARTMENT;
        this.reportingTo = this.userDetail[0].REPORTING_TO;
        this.selectedLocation = this.userDetail[0].EMP_LOCATION;
        this.empDojDate = this.userDetail[0].EMP_DOJ_DATE;
        this.selectedEmptSts = this.userDetail[0].EMP_STATUS;

        // console.log("user detail", Response)

      }))
      .subscribe();

  }

  closeNewUserModal() {
    this.newUserModal = false;
    this.editUserModal = false;
    this.usersDetailsContainer = true;
    this.selectedDepartment = "";
    this.selectedDesignation = "";
    this.selectedLocation = "";
    this.selectedEmptSts = "";
    this.overviewUserModal = false
    this.newUserForm.reset();
  }

  closeEditNoverviewModal() {
    this.overviewUserModal = false
    this.newUserModal = false;
    this.editUserModal = false;
    this.usersDetailsContainer = true;
    this.selectedDepartment = "";
    this.selectedDesignation = "";
    this.selectedLocation = "";
    this.selectedEmptSts = "";
    this.isFormChanged = false;

    this.personalDetails = true;
    this.activityLog = false;
  }

  // closeOverviewUserModal() {
  //   this.overviewUserModal = false
  //   this.newUserModal = false;
  //   this.editUserModal = false;
  //   this.usersDetailsContainer = true;
  //   this.selectedDepartment = "";
  //   this.isFormChanged = false;

  //   this.personalDetails = true;
  //   this.activityLog = false;
  // }

  async addUser() {

    console.log('Form Submitted:', this.newUserForm.value);
    if (this.newUserForm.valid) {

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      const options = { withCredentials: true, };
      let url: string;
      url = GlobalConstants.apiAddUser;

      const param = new HttpParams()
        .set('empId', this.newUserForm.value.empId)
        .set('firstName', this.newUserForm.value.firstName)
        .set('middleName', this.newUserForm.value.middleName)
        .set('lastName', this.newUserForm.value.lastName)
        .set('emailAddress', this.newUserForm.value.emailAddress)
        .set('mobileNo', this.newUserForm.value.mobileNo)
        .set('empDesignation', this.selectedDesignation)
        .set('empDepartment', this.selectedDepartment)
        .set('reportingTo', this.newUserForm.value.reportingTo)
        .set('empLocation', this.selectedLocation)
        .set('empDojDate', this.newUserForm.value.empDojDate)
        .set('empStatus', this.selectedEmptSts)

      console.log(param);

      await this.httpcli.post<any>(url, param, options)
        .pipe(map(Response => {

          console.log(Response)

          if (Response.message == "Duplicate ID") {
            alert("This Employee Id is already registered with us.")
          } else if (Response.affectedRows == 1) {
            window.location.reload();
          }


        }))
        .subscribe(() => { }, () => {
        });
      console.log('Form Submitted:', this.newUserForm.value);
    } else {
      console.log('Form is invalid');
    }
  }



  async editUser() {
    if (this.editUserForm.valid) {

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      const options = { withCredentials: true };
      let url: string;
      url = GlobalConstants.apiEditUser;

      const param = new HttpParams()
        .set('empId', this.editUserForm.value.empId)
        .set('firstName', this.editUserForm.value.firstName)
        .set('middleName', this.editUserForm.value.middleName)
        .set('lastName', this.editUserForm.value.lastName)
        .set('emailAddress', this.editUserForm.value.emailAddress)
        .set('mobileNo', this.editUserForm.value.mobileNo)
        .set('empDesignation', this.selectedDesignation)
        .set('empDepartment', this.selectedDepartment)
        .set('reportingTo', this.editUserForm.value.reportingTo)
        .set('empLocation', this.selectedLocation)
        .set('empDojDate', this.editUserForm.value.empDojDate)
        .set('empStatus', this.selectedEmptSts)

      console.log(param);

      await this.httpcli.post<any>(url, param, options)
        .pipe(map(Response => {

          console.log(Response)

          window.location.reload();
        }))
        .subscribe(() => { }, () => {
        });

      console.log('Form Submitted:', this.editUserForm.value);
    } else {
      console.log('Form is invalid');
    }

  }


  async getDepartmentList() {

    // var url = GlobalConstants.apiActiveDepartmentList;
    // let asyncResult = await this.httpcli.get<any[]>(url, { responseType: 'text' as 'json', withCredentials: true }).toPromise();
    // this.departmentList = asyncResult;
        let asyncResult = await firstValueFrom(this.settingService.getActiveSettingList(1));

    if (asyncResult) {

      try {
        this.departmentList = this.encdec.decodeData(asyncResult);

      } catch (error) {
        console.error('JSON Parsing Error:', error);

      }
    } else {
      console.error('No data received from the server');

    }

    this.departmentNames = this.departmentList.map((dept: { DEPARTMENT: any; }) => dept.DEPARTMENT);

    this.filteredDepartments = this.departmentNames;

    // console.log(this.departmentNames);
  }
  async getDesignationList(){
    let asyncResult = await firstValueFrom(this.settingService.getActiveSettingList(2));
    if (asyncResult) {
      try {
        this.designationList = this.encdec.decodeData(asyncResult);
      } catch (error) {
        console.error('JSON Parsing Error:', error);
      }
    } else {
      console.error('No data received from the server');
    }
    this.designationNames = this.designationList.map((desg: { DESIGNATION: any; }) => desg.DESIGNATION);
    this.filteredDesignations = this.designationNames;
  }

  async getActiveLocationList(){
    let asyncResult = await firstValueFrom(this.settingService.getActiveSettingList(5));
    if (asyncResult) {
      try {
        this.locationList = this.encdec.decodeData(asyncResult);
      } catch (error) {
        console.error('JSON Parsing Error:', error);
      }
    } else {
      console.error('No data received from the server');
    }
    this.locationNames = this.locationList.map((data: { LOCATION: any; }) => data.LOCATION);
    this.filteredLocations = this.locationNames;
  }

  async getActiveEmptStsList(){
    let asyncResult = await firstValueFrom(this.settingService.getActiveSettingList(3));
    if (asyncResult) {
      try {
        this.emptStsList = this.encdec.decodeData(asyncResult);
      } catch (error) {
        console.error('JSON Parsing Error:', error);
      }
    } else {
      console.error('No data received from the server');
    }
    this.emptStsNames = this.emptStsList.map((data: { EMPLOYMENT_STATUS: any; }) => data.EMPLOYMENT_STATUS);
    this.filteredEmptSts = this.emptStsNames;
  }

    // Filter departments dynamically
    filterDepartments(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.searchTerm = value;
  
      if (this.searchTerm.length === 0) {
        this.filteredDepartments = this.departmentNames;
        return;
      } else {
        this.filteredDepartments = this.departmentNames.filter(dept =>
          dept.toLowerCase().includes(this.searchTerm.toLowerCase().trim())
        );
      }
    }
  
    // Filter designation dynamically
    filterDesignations(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.desgSearchTerm = value;
  
      if (this.desgSearchTerm.length === 0) {
        this.filteredDesignations = this.designationNames;
        return;
      } else {
        this.filteredDesignations = this.designationNames.filter(desg =>
          desg.toLowerCase().includes(this.desgSearchTerm.toLowerCase().trim())
        );
      }
    }
  
    filterLocations(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.locationSearchTerm = value;
  
      if (this.locationSearchTerm.length === 0) {
        this.filteredLocations = this.locationNames;
        return;
      } else {
        this.filteredLocations = this.locationNames.filter(data =>
          data.toLowerCase().includes(this.locationSearchTerm.toLowerCase().trim())
        );
      }
    }
  
    filterEmptSts(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.emptStsSearchTerm = value;
  
      if (this.emptStsSearchTerm.length === 0) {
        this.filteredEmptSts = this.emptStsNames;
        return;
      } else {
        this.filteredEmptSts = this.emptStsNames.filter(data =>
          data.toLowerCase().includes(this.emptStsSearchTerm.toLowerCase().trim())
        );
      }
    }


   // Select a department
   selectDepartment(dept: string) {

    this.isFormChanged = (this.selectedDepartment !== dept);
    this.selectedDepartment = dept;

    const newUserDepartmentControl = this.newUserForm.get('empDepartment');

    if (!this.selectedDepartment || this.selectedDepartment.trim() === '') {
      newUserDepartmentControl?.setErrors({ customError: true });
    } else {
      newUserDepartmentControl?.setErrors(null);
    }

  }

  selectDesignation(desg: string) {

    this.isFormChanged = (this.selectedDesignation !== desg);
    this.selectedDesignation = desg;

    const newUserDesgControl = this.newUserForm.get('empDesignation');
    if (!this.selectedDesignation || this.selectedDesignation.trim() === '') {
      newUserDesgControl?.setErrors({ customError: true });
    } else {
      newUserDesgControl?.setErrors(null);
    }

  }

  selectLocation(location: string) {

    this.isFormChanged = (this.selectedLocation !== location);
    this.selectedLocation = location;

    const newUserLocationControl = this.newUserForm.get('empLocation');
    if (!this.selectedLocation || this.selectedLocation.trim() === '') {
      newUserLocationControl?.setErrors({ customError: true });
    } else {
      newUserLocationControl?.setErrors(null);
    }

  }

  selectEmptSts(empt: string) {

    this.isFormChanged = (this.selectedEmptSts !== empt);
    this.selectedEmptSts = empt;

    const newUserLocationControl = this.newUserForm.get('empStatus');
    if (!this.selectedEmptSts || this.selectedEmptSts.trim() === '') {
      newUserLocationControl?.setErrors({ customError: true });
    } else {
      newUserLocationControl?.setErrors(null);
    }

  }

  departmentDropdown() {
    this.searchTerm = "";
    this.getDepartmentList();
  }
  designationDropdown(){
    this.desgSearchTerm = "";
    this.getDesignationList();
  }
  locationDropDown(){
    this.locationSearchTerm = "";
    this.getActiveLocationList();
  }
  emptStsDropDown(){
    this.emptStsSearchTerm = "";
    this.getActiveEmptStsList();
  }

  // Compare current form values to the original values
  onInputChange(event: Event) {

    const value = (event.target as HTMLInputElement).value;

    this.isFormChanged = (
      this.firstName !== value ||
      this.middleName !== value ||
      this.lastName !== value ||
      this.emailAddress !== value ||
      this.mobileNo !== value ||
      // this.empDesignation !== value ||
      this.reportingTo !== value ||
      // this.empLocation !== value ||
      this.empDojDate !== value 
      // this.empStatus !== value
    );
  }


  deleteUser(user: any) {
    this.userDelete = user;
    this.deleteUserId = this.userDelete.EMP_ID;
  }

  async deleteSelectedUser() {

    const urllink = GlobalConstants.apiDeleteUser + this.selectedEmpId;

    await this.httpcli.get<any[]>(urllink, { withCredentials: true })
      .pipe(map(Response => {
        this.deleteResponse = Response;
        window.location.reload();
        console.log("delete Response", Response)
      }))
      .subscribe();
  }


  selectedRow(empId: string, fromButton: boolean) {
    if (fromButton) {
      this.clickedFromButton = true;
      return;
    }
    if (this.selectedEmpId === empId) {
      if (!this.clickedFromButton) {
        this.selectedEmpId = null;
        this.moreFilter = false;
      }
    } else {
      this.selectedEmpId = empId;
      this.moreFilter = true;
    }
    this.clickedFromButton = false;
  }

  handleButtonClick(empId: string) {
    this.selectedRow(empId, true);
  }


  async inviteUser(user: any) {
    const userId = user.EMP_ID;
    const userEmail = user.EMAIL_ADDRESS;

    const options = { withCredentials: true };
    let url: string;
    url = GlobalConstants.apiSendInvite;

    console.log(userId, userEmail)


    return await this.httpcli.post<any>(url, { userID: userId, userEmail: userEmail }, options)
      .pipe(map(Response => {

        console.log(Response)

        alert("Invitation has been sent!")
        window.location.reload();
      }))
      .subscribe(() => { }, () => {
      });

  }

}
