import { NgFor, NgIf, NgClass, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormBuilder } from '@angular/forms';
import { EncryptionService } from '../../../../../services/encryption.service';
import { GlobalConstants } from '../../../../../shared/common/global-constants';
import { firstValueFrom } from 'rxjs';
import { settingUpdateData } from '../../../../../shared/common/expense.type';
import { SettingsService } from '../../../../../services/settings.service';

@Component({
  selector: 'app-av-global-settings',
  standalone: true,
  imports: [NgFor, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './av-global-settings.component.html',
  styleUrl: './av-global-settings.component.scss'
})
export class AvGlobalSettingsComponent {

  modalContext: string = '';
  modalValue: string = '';
  isInsertModalOpen: boolean = false;   



  sideModelDataCount:number=0;
  selectedStatus: string = '';
  selectedId:number =0 ;
  actionBar: boolean = false;
  departmentList: any;
  departmentNames: string[] = [];
  filteredDepartments: string[] = [];
  designationList: any;
  designationNames: string[] = [];
  filteredDesignations: string[] = [];
  gradeList: any;
  gradeNames: string[] = [];
  filteredGrades:string[]=[];
  locationList:any;
  locationNames:string[]=[];
  filteredLocation:string[]=[];
  iRoleList:any;
  iRoleNames:string[]=[];
  filteredRoles:string[]=[];
  employmentStatusList:any
  employmentSts:string[]=[];
  filteredEmptSts:string[]=[];
  

  filteredContainer: string[] = [];
  searchTerm: string = "";
  designationSearchTerm: string = "";
  gradeSearchTerm: string = "";
  empStsSearchTerm:string = "";
  locationSearchTerm:string = "";
  roleSearchTerm:string = "";
  modalTitle = '';
  modalType = ''; 

  modalData: settingUpdateData[] = [];
  filteredModalData: settingUpdateData[] = [];
  sideSearchTerm = '';


  selectedItem = '';
  updateModalTitle = '';
  updateFieldLabel = '';
  updateInputModel = ''; 

  searchControl = new FormControl('');
  classAplus: any[] = [];
  classA: any[] = [];

  filteredLocations: string[] = []; // Filtered list
  searchLocation: string = ''; // Search input value
  // searchTerm = signal('');
  selectedLocation: string = ''; // Selected department

  constructor(private httpcli: HttpClient, private fb: FormBuilder, private encdec: EncryptionService, private settingService: SettingsService) {

  }


  locationDropdown() {
    this.searchLocation = "";
  }

  selectLocation(location: string) {
    this.selectedLocation = location;
  }

  allLocations: any[] = [];
  classAPlusLocations: any[] = [];
  classALocations: any[] = [];
  classBLocations: any[] = [];

  async searchLocations(event: Event) {
    const searchLocation = (event.target as HTMLInputElement).value;

    let apiUrl = GlobalConstants.apiSearchLocations;

    if (searchLocation !== "" || searchLocation == null) {
      await this.httpcli.get<any[]>(`${apiUrl}${searchLocation}`, { withCredentials: true }).subscribe(response => {
        this.allLocations = response;

        this.classAPlusLocations = this.allLocations.filter((item: { TYPE_STS: any; }) => item.TYPE_STS == 1)
        this.classALocations = this.allLocations.filter((item: { TYPE_STS: any; }) => item.TYPE_STS == 2)
        this.classBLocations = this.allLocations.filter((item: { TYPE_STS: any; }) => item.TYPE_STS == 3)

        // console.log(this.allLocations)
      });

    } else {
      this.classAPlusLocations = [];
      this.classALocations = [];
      this.classBLocations = [];

      this.allLocations = [];
    }


  }

  async searchClassAPlusLocation(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;

    let apiUrl = GlobalConstants.apiSearchClassAPlusLocation;

    if (searchTerm !== "" || searchTerm == null) {
      await this.httpcli.get<any[]>(`${apiUrl}${searchTerm}`, { withCredentials: true }).subscribe(response => {
        this.classAplus = response;
        console.log(this.classAplus)
      });

    } else {
      this.classAplus = [];
    }

  }


  async searchClassALocation(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;

    let apiUrl = GlobalConstants.apiSearchClassALocation;

    if (searchTerm !== "" || searchTerm == null) {
      await this.httpcli.get<any[]>(`${apiUrl}${searchTerm}`, { withCredentials: true }).subscribe(response => {
        this.classA = response;
        console.log(this.classA)
      });

    } else {
      this.classA = [];
    }


  }

  isModalOpen = false;

  openModal(modelTitle:string) {
    this.modalContext = modelTitle;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openInsertModal(context: 'Department' | 'Designation' | 'Grade'| 'Location' |'Employment Status' | 'Role', value: string){
    this.modalContext = context;
    this.modalValue = value;
    this.isInsertModalOpen = true;
  }
  
  // Close Modal
  closeInsertModal(): void {
    this.isInsertModalOpen = false;
    this.modalContext = '';
    this.modalValue = '';
  }

  ngOnInit(): void {
    this.getDepartmentList();
    this.getDesignationList();
    this.getGradeList();
    this.getEmploymentStatusList();
    this.getLocationList();
    this.getIRoleList();
  }


  sideActionBar() {
    this.actionBar = true;
    this.sideSearchTerm = '';
  }

  closeSideActionBar() {
    this.actionBar = false;
    this.sideSearchTerm = '';
    this.activeLabel = '';
  }
  activeLabel: string = '';

  handleSideModal(type: string): void {
    this.activeLabel = type;
    this.sideActionBar();
    this.openSideModal(type);
  }


  async getDepartmentList() {

    // var url = GlobalConstants.apiDepartmentList;;
    // let asyncResult = await this.httpcli.get<any[]>(url, {responseType: 'text' as 'json' , withCredentials: true }).toPromise();
    let asyncResult = await firstValueFrom(this.settingService.getSettingList(1));
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

    this.openSideModal('department');

  }

  async getDesignationList() {
    let asyncResult = await firstValueFrom(this.settingService.getSettingList(2));
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
    console.log("this.designationNames", this.designationNames);
    this.filteredDesignations = this.designationNames;
    this.openSideModal('designation');
    


  }

  async getLocationList() {
    let asyncResult = await firstValueFrom(this.settingService.getSettingList(5));
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
    console.log("this.locationList", this.locationList);
    this.filteredLocation = this.locationNames;
    this.openSideModal('location');


  }

  async getGradeList(){
    let asyncResult = await firstValueFrom(this.settingService.getSettingList(4));
    
    if (asyncResult) {
      try {
        this.gradeList = this.encdec.decodeData(asyncResult);
      } catch (error) {
        console.error('JSON Parsing Error:', error);
      }
    } else {
      console.error('No data received from the server');
    }

    this.gradeNames = this.gradeList.map((data: { GRADE: any; }) => data.GRADE);
    console.log("this.gradeNames", this.gradeNames);
     this.filteredGrades = this.gradeNames;
     this.openSideModal('grade');
  }

  async getEmploymentStatusList(){
    let asyncResult = await firstValueFrom(this.settingService.getSettingList(3));
    
    if (asyncResult) {
      try {
        this.employmentStatusList = this.encdec.decodeData(asyncResult);
      } catch (error) {
        console.error('JSON Parsing Error:', error);
      }
    } else {
      console.error('No data received from the server');
    }

    this.employmentSts = this.employmentStatusList.map((data: { EMPLOYMENT_STATUS: any; }) => data.EMPLOYMENT_STATUS);
    console.log("this.employmentSts", this.employmentSts);
    this.filteredEmptSts = this.employmentSts;
    this.openSideModal('employment');
  }

  async getIRoleList(){
    let asyncResult = await firstValueFrom(this.settingService.getSettingList(6));
    
    if (asyncResult) {
      try {
        this.iRoleList = this.encdec.decodeData(asyncResult);
      } catch (error) {
        console.error('JSON Parsing Error:', error);
      }
    } else {
      console.error('No data received from the server');
    }

    this.iRoleNames = this.iRoleList.map((data: { ROLE: any; }) => data.ROLE);
    console.log("this.iRoleNames", this.iRoleNames);
    this.filteredRoles = this.iRoleNames;
    this.openSideModal('role');
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

  filterDesignation(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.designationSearchTerm = value;

    if (this.designationSearchTerm.length === 0) {
      this.filteredDesignations = this.designationNames;
      return;
    } else {
      this.filteredDesignations = this.designationNames.filter(data =>
        data.toLowerCase().includes(this.designationSearchTerm.toLowerCase().trim())
      );
    } 

  }

  filterLocation(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.locationSearchTerm = value;

    if (this.locationSearchTerm.length === 0) {
      this.filteredLocation = this.locationNames;
      return;
    } else {
      this.filteredLocation = this.locationNames.filter(data =>
        data.toLowerCase().includes(this.locationSearchTerm.toLowerCase().trim())
      );
    } 

  }

  filterGrades(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.gradeSearchTerm = value;

    if (this.gradeSearchTerm.length === 0) {
      this.filteredGrades = this.gradeNames;
      return;
    } else {
      this.filteredGrades = this.gradeNames.filter(data =>
        data.toLowerCase().includes(this.gradeSearchTerm.toLowerCase().trim())
      );
    }
    
  }
  filterEmpSts(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.empStsSearchTerm = value;

    if (this.empStsSearchTerm.length === 0) {
      this.filteredEmptSts = this.employmentSts;
      return;
    } else {
      this.filteredEmptSts = this.employmentSts.filter(data =>
        data.toLowerCase().includes(this.empStsSearchTerm.toLowerCase().trim())
      );
    }
    
  }
  filterRoles(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.roleSearchTerm = value;

    if (this.roleSearchTerm.length === 0) {
      this.filteredRoles = this.iRoleNames;
      return;
    } else {
      this.filteredRoles = this.iRoleNames.filter(data =>
        data.toLowerCase().includes(this.roleSearchTerm.toLowerCase().trim())
      );
    }
    
  }


  openSideModal(type: string) {
    this.modalType = type;
    
    switch (type) {
      case 'department':
        this.modalTitle = 'Department';
        this.modalData = this.departmentList.map((d: any) => ({
          id:d.ID,
          name: d.DEPARTMENT, 
          status: d.ACTIVE_STS
        }));
        break;
      case 'designation':
        this.modalTitle = 'Designation';
        this.modalData = this.designationList.map((d: any) => ({
          id:d.ID,
          name: d.DESIGNATION,
          status: d.ACTIVE_STS
        }));
        break;
      case 'grade':
        this.modalTitle = 'Grade';
        this.modalData = this.gradeList.map((d: any) => ({
          id:d.SN,
          name: d.GRADE,
          status: d.ACTIVE_STS
        }));
        break;
        case 'location':
          this.modalTitle = 'Location';
          this.modalData = this.locationList.map((d: any) => ({
            id:d.ID,
            name: d.LOCATION,
            status: d.ACTIVE_STS
          }));
          break;
      case 'employment':
        this.modalTitle = 'Employment Status';
        this.modalData = this.employmentStatusList.map((d: any) => ({
          id:d.ID,
          name: d.EMPLOYMENT_STATUS, 
          status: d.ACTIVE_STS
        }));
        break;
      case 'role':
          this.modalTitle = 'Role';
          this.modalData = this.iRoleList.map((d: any) => ({
            id:d.ID,
            name: d.ROLE, 
            status: d.ACTIVE_STS
          }));
          break;
    }
  
    this.filteredModalData = [...this.modalData];
    this.sideModelDataCount = this.filteredModalData.length;
    console.log("Mapped modal data:", this.filteredModalData);
  }
  
  
  

  selectModalContentForUpdate(item: settingUpdateData) {
    this.selectedItem = item.name;
    this.updateInputModel = item.name;
    this.selectedStatus = item.status;
    this.selectedId = item.id;
  
    this.updateModalTitle = 'Update ' + this.modalTitle;
    this.updateFieldLabel = this.modalTitle ;
  
  }
  



  // filterSidecontainer(event: Event) {
  //   const value = (event.target as HTMLInputElement).value;

  //   this.sideSearchTerm = value;

  //   if (this.sideSearchTerm.length === 0) {
  //     this.filteredContainer = this.departmentNames;
  //     return;
  //   } else {
  //     this.filteredContainer = this.departmentNames.filter(dept =>
  //       dept.toLowerCase().includes(this.sideSearchTerm.toLowerCase().trim())
  //     );
  //   }
  // }

  filterSidecontainer(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.sideSearchTerm = value;
  
    this.filteredModalData = this.modalData.filter(item =>
      item.name.toLowerCase().includes(this.sideSearchTerm)
    );
    this.sideModelDataCount = this.filteredModalData.length;
  }

  applySideFilter() {
    this.filteredModalData = [...this.modalData];
    this.sideModelDataCount = this.filteredModalData.length;
  }
  
  



  //  async insertGlobalSettingData() {
  //   let response:any;
  //   console.log(" add model contex is",this.modalContext);
  //   switch (this.modalContext) {
  //     case 'department':
  //       console.log("added value in dept is", this.modalValue);
  //       response = await this.settingService.insertNewDepartment(this.modalValue).toPromise();
  //       console.log(response);
  //       if(response){
  //         this.searchTerm = '';
  //         this.getDepartmentList(); 
  //         const affectedRows = response['affectedRows'];
  //         if(affectedRows==1){
  //           alert('Department added successfully.');
  //         }else{
            
  //           alert('Error: Unable to add department.');
  //         }
  //       }
  //       break;
  //     case 'designation':
  //       console.log("added value in desg is", this.modalValue);

  //        response = await this.settingService.insertNewDesignation(this.modalValue).toPromise();
  //       if(response){
  //         this.designationSearchTerm = '';
  //         this.getDesignationList();
  //         const affectedRows = response['affectedRows'];
  //         if(affectedRows==1){
  //           alert('Designation added successfully.');
  //         }else{
  //           alert('Error: Unable to add Designation.');
  //         }
  //       }

  //       break;
  //     case 'grade':
  //       console.log("added value in grade is", this.modalValue);

  //       response = await this.settingService.insertNewGrade(this.modalValue).toPromise();
  //       console.log(response);
  //       if(response){
  //         this.gradeSearchTerm = '';
  //         this.getGradeList()
  //         const affectedRows = response['affectedRows'];
  //         if(affectedRows==1){
  //           alert('Grade added successfully.');
  //         }else{
  //           alert('Error: Unable to add Grade.');
  //         }
  //       }
  //       break;

  //       case 'employmentSts':
      
  //       response = await this.settingService.insertNewEmptSts(this.modalValue).toPromise();
  //       if(response){
  //         this.empStsSearchTerm = '';
  //         this.getEmploymentStatusList();
  //         const affectedRows = response['affectedRows'];
  //         if(affectedRows==1){
  //           alert('Employment Status added successfully.');
  //         }else{
  //           alert('Error: Unable to add Employment Status.');
  //         }
  //       }
  //       break;

  //       case 'location':
      
  //       response = await this.settingService.insertNewLocation(this.modalValue).toPromise();
  //       if(response){
  //         this.locationSearchTerm = '';
  //         this.getLocationList();
  //         const affectedRows = response['affectedRows'];
  //         if(affectedRows==1){
  //           alert('Location added successfully.');
  //         }else{
  //           alert('Error: Unable to add Location.');
  //         }
  //       }
  //       break;
  //   }
  //   this.closeInsertModal();
  // }

  async insertGlobalSettingData() {
    let response: any;
    console.log(" add model contex is", this.modalContext);
  
    switch (this.modalContext) {
      case 'Department':
        console.log("added value in dept is", this.modalValue);
        response = await firstValueFrom(this.settingService.insertGlobalSettingData(1,this.modalValue));
        console.log(response);
        if (response) {
          this.searchTerm = '';
          this.getDepartmentList();
          const affectedRows = response['affectedRows'];
          if (affectedRows == 1) {
            alert('Department added successfully.');
          } else {
            alert('Error: Unable to add department.');
          }
        }
        break;
  
      case 'Designation':
        console.log("added value in desg is", this.modalValue);
        response = await firstValueFrom(this.settingService.insertGlobalSettingData(2,this.modalValue));
        if (response) {
          this.designationSearchTerm = '';
          this.getDesignationList();
          const affectedRows = response['affectedRows'];
          if (affectedRows == 1) {
            alert('Designation added successfully.');
          } else {
            alert('Error: Unable to add Designation.');
          }
        }
        break;
  
      case 'Grade':
        console.log("added value in grade is", this.modalValue);
        response = await firstValueFrom(this.settingService.insertGlobalSettingData(4,this.modalValue));
        if (response) {
          this.gradeSearchTerm = '';
          this.getGradeList();
          const affectedRows = response['affectedRows'];
          if (affectedRows == 1) {
            alert('Grade added successfully.');
          } else {
            alert('Error: Unable to add Grade.');
          }
        }
        break;
  
      case 'Employment Status':
        response = await firstValueFrom(this.settingService.insertGlobalSettingData(3,this.modalValue));
        if (response) {
          this.empStsSearchTerm = '';
          this.getEmploymentStatusList();
          const affectedRows = response['affectedRows'];
          if (affectedRows == 1) {
            alert('Employment Status added successfully.');
          } else {
            alert('Error: Unable to add Employment Status.');
          }
        }
        break;
  
      case 'Location':
        response = await firstValueFrom(this.settingService.insertGlobalSettingData(5,this.modalValue));
        if (response) {
          this.locationSearchTerm = '';
          this.getLocationList();
          const affectedRows = response['affectedRows'];
          if (affectedRows == 1) {
            alert('Location added successfully.');
          } else {
            alert('Error: Unable to add Location.');
          }
        }
        break;
      case 'Role':
          response = await firstValueFrom(this.settingService.insertGlobalSettingData(6,this.modalValue));
          if (response) {
            this.roleSearchTerm = '';
            this.getIRoleList();
            const affectedRows = response['affectedRows'];
            if (affectedRows == 1) {
              alert('Role added successfully.');
            } else {
              alert('Error: Unable to add ROle.');
            }
          }
          break;
    }
  
    this.closeInsertModal();
  }
  


  // async updateGlobalSettingData(updateInputModel:string) {
  //   let response:any;
  //   console.log("model contex is",this.modalContext);
  //   switch (this.modalContext) {
  //     case 'Department':
  //       console.log("update department");
        
  //       response = await this.settingService.updateIDepartment(this.selectedId,updateInputModel, this.selectedStatus).toPromise();
  //       console.log(response);
  //       if(response){
  //         const affectedRows = response['affectedRows'];
  //         if(affectedRows==1){
  //           this.getDepartmentList(); 

  //           alert('Department updated successfully.');
  //         }else{
  //           alert('Error: Unable to update department.');
  //         }
  //       }
  //       break;

  //       case 'Designation':
  //         console.log("update designation");
          
  //         response = await this.settingService.updateIDesignation(this.selectedId, updateInputModel, this.selectedStatus).toPromise();
  //         console.log(response);
  //         if(response){
  //           const affectedRows = response['affectedRows'];
  //           if(affectedRows==1){
  //             this.getDesignationList(); 
  
  //             alert('Designation updated successfully.');
  //           }else{
  //             alert('Error: Unable to update Designation.');
  //           }
  //         }
  //         break;

  //         case 'Location':
  //         console.log("update location");
          
  //         response = await this.settingService.updateIshidaLocation( this.selectedId, updateInputModel, this.selectedStatus).toPromise();
  //         console.log(response);
  //         if(response){
  //           const affectedRows = response['affectedRows'];
  //           if(affectedRows==1){
  //             this.getLocationList(); 
  
  //             alert('Location updated successfully.');
  //           }else{
  //             alert('Error: Unable to update Location.');
  //           }
  //         }
  //         break;

  //         case 'Grade':
  //         console.log("update location");
          
  //         response = await this.settingService.updateIGrade( this.selectedId, updateInputModel, this.selectedStatus).toPromise();
  //         console.log(response);
  //         if(response){
  //           const affectedRows = response['affectedRows'];
  //           if(affectedRows==1){
  //             this.getGradeList(); 
  
  //             alert('Grade updated successfully.');
  //           }else{
  //             alert('Error: Unable to update Grade.');
  //           }
  //         }
  //         break;

  //         case 'Employment Status':
  //         console.log("update location");
          
  //         response = await this.settingService.updateIEmptSts( this.selectedId, updateInputModel, this.selectedStatus).toPromise();
  //         console.log(response);
  //         if(response){
  //           const affectedRows = response['affectedRows'];
  //           if(affectedRows==1){
  //             this.getEmploymentStatusList(); 
  
  //             alert('Employment status updated successfully.');
  //           }else{
  //             alert('Error: Unable to update Employment status.');
  //           }
  //         }
  //         break;
      
  //   }
  //   this.closeInsertModal();
  // }

  async updateGlobalSettingData(updateInputModel: string) {
    let response: any;
    console.log("model context is", this.modalContext);
  
    switch (this.modalContext) {
      case 'Department':
        console.log("update department");
        response = await firstValueFrom(this.settingService.updateGlobalSettingData(1,this.selectedId, updateInputModel, this.selectedStatus));
        if (response?.affectedRows === 1) {
          this.getDepartmentList();
          alert('Department updated successfully.');
        } else {
          alert('Error: Unable to update department.');
        }
        break;
  
      case 'Designation':
        console.log("update designation");
        response = await firstValueFrom(this.settingService.updateGlobalSettingData(2,this.selectedId, updateInputModel, this.selectedStatus));
        if (response?.affectedRows === 1) {
          this.getDesignationList();
          alert('Designation updated successfully.');
        } else {
          alert('Error: Unable to update Designation.');
        }
        break;
  
      case 'Location':
        console.log("update location");
        response = await firstValueFrom(this.settingService.updateGlobalSettingData(5,this.selectedId, updateInputModel, this.selectedStatus));
        if (response?.affectedRows === 1) {
          this.getLocationList();
          this.applySideFilter(); 
          alert('Location updated successfully.');
        } else {
          alert('Error: Unable to update Location.');
        }
        break;
  
      case 'Grade':
        console.log("update grade");
        response = await firstValueFrom(this.settingService.updateIGrade(this.selectedId, updateInputModel, this.selectedStatus));
        if (response?.affectedRows === 1) {
          this.getGradeList();
          this.applySideFilter(); 
          alert('Grade updated successfully.');
        } else {
          alert('Error: Unable to update Grade.');
        }
        break;

      case 'Role':
          console.log("update role");
          response = await firstValueFrom(this.settingService.updateGlobalSettingData(6,this.selectedId, updateInputModel, this.selectedStatus));
          if (response?.affectedRows === 1) {
            this.getIRoleList();
            this.applySideFilter(); 
            alert('Role updated successfully.');
          } else {
            alert('Error: Unable to update Role.');
          }
          break;
  
      case 'Employment Status':
        console.log("update employment status");
        response = await firstValueFrom(this.settingService.updateGlobalSettingData(3,this.selectedId, updateInputModel, this.selectedStatus));
        if (response?.affectedRows === 1) {
          this.getEmploymentStatusList();
          this.applySideFilter(); 
          alert('Employment status updated successfully.');
        } else {
          alert('Error: Unable to update Employment status.');
        }
        break;
    }
  
    this.closeInsertModal();
  }

  globalSettingStatus(sts: string): string {

    let status = sts.toString();
    switch (status) {

      case "0":
        status = "Inactive";
        break;
      case "1":
        status = "Active";
        break;
      default:
        status = "ERROR";
        break;
    }
    return status;
  }






}
