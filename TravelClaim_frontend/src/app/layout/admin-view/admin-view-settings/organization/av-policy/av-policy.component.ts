import { NgIf, NgClass, NgFor } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, map } from 'rxjs';
import { EncryptionService } from '../../../../../services/encryption.service';
import { AllowanceData } from '../../../../../shared/common/expense.type';
import { GlobalConstants } from '../../../../../shared/common/global-constants';

@Component({
  selector: 'app-av-policy',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule, NgFor],
  templateUrl: './av-policy.component.html',
  styleUrl: './av-policy.component.scss'
})
export class AvPolicyComponent {


policyDetailsContainer: boolean = true;
  newPolicyContainer: boolean = false;
  policyTab: boolean = true;
  fuelTab: boolean = false;
  domesticTab: boolean = false;

  selectedFileName: string = '';
  selectedVehicle1: string = '';
  selectedVehicle2: string = '';

  numberOfGrades = 0;

  allowanceData:any;
  allowance: AllowanceData[] = [];
  gradeList: any;
  gradesNames: string[] = []

  constructor(private httpcli: HttpClient,private encdec: EncryptionService) {

  }
  ngOnInit(): void {
    this.getAllowanceData();
    this.getGradetList();
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      console.log(this.selectedFileName);
    }
  }


  newPolicy() {
    this.policyDetailsContainer = false;
    this.newPolicyContainer = true;
    this.policyTab = true;
  }


  closeNewPolicyModal() {
    this.policyDetailsContainer = true;
    this.newPolicyContainer = false;
    this.policyTab = false;
    this.fuelTab = false;
    this.domesticTab = false;
    this.selectedFileName = "";
  }


  newPolicyTab() {
    this.policyTab = true;
    this.fuelTab = false;
    this.domesticTab = false;
  }

  fuelSettingTab() {
    this.policyTab = false;
    this.fuelTab = true;
    this.domesticTab = false;
  }

  domesticAllowTab() {
    this.policyTab = false;
    this.fuelTab = false;
    this.domesticTab = true;
    this.getAllowanceData();
  }


  updateDisabledOptions() {
    if (!this.selectedVehicle1) {
      this.selectedVehicle2 = this.selectedVehicle2;
    }
    if (!this.selectedVehicle2) {
      this.selectedVehicle1 = this.selectedVehicle1;
    }
  }



  async getGradetList() {

    var url = GlobalConstants.apiGetGradesList;
    let asyncResult = await firstValueFrom(this.httpcli.get<any[]>(url, {responseType: 'text' as 'json' , withCredentials: true }));
    // this.gradeList = asyncResult;

    if (asyncResult) {
      try {
        this.gradeList = this.encdec.decodeData(asyncResult);
      } catch (error) {
        console.error('JSON Parsing Error:', error);
      }
    } else {
      console.error('No data received from the server');
    }

    this.gradesNames = this.gradeList.map((grade: { GRADE: any; }) => grade.GRADE);

    // this.filteredDepartments = this.departmentNames;
    this.numberOfGrades = this.gradesNames.length;
    console.log(this.gradesNames);
  }



  addRow() {

    if (this.allowance.length < this.numberOfGrades) {
      this.allowance.push({ selectedGrade: '', classAPlus: null, classA: null, classB: null, domesticFa: null, domesticDa: null, overseasFa: null, overseasDa: null });
    }
  }

  removeRow(index: number) {
    const gradeToDelete = this.allowance[index].selectedGrade;

    console.log(gradeToDelete)

    this.deleteSelectedGrade(gradeToDelete);

    this.allowance.splice(index, 1);
    this.updateSelectedGrades(); // Update disabled states after removal

  }


  async deleteSelectedGrade(grade: string) {

    if(grade){
      const urllink = GlobalConstants.apiDeleteGradeRow + grade;

     await this.httpcli.get<any[]>(urllink, { withCredentials: true })
        .pipe(map(Response => {
  
          // this.deleteResponse = Response;
  
          // window.location.reload();
  
          console.log("delete Response", Response)
        }))
        .subscribe();
    }

  }


  getSelectedGrades(): string[] {
    return this.allowance.map(row => row.selectedGrade).filter(grade => grade);
  }

  isGradeDisabled(grade: string): boolean {
    return this.getSelectedGrades().includes(grade);
  }

  updateSelectedGrades() {
    this.allowance = [...this.allowance]; 
  }


  async saveData() {
    
    let url: string;
    url = GlobalConstants.apiSaveAllowance;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, withCredentials: true };

    // Send an array of allowance objects
    const allowancesArray = this.allowance.map(row => ({
      selectedGrade: row.selectedGrade,
      classAPlus: row.classAPlus,
      classA: row.classA,
      classB: row.classB,
      domesticDa: row.domesticDa,
      domesticFa: row.domesticFa,
      overseasDa: row.overseasDa,
      overseasFa: row.overseasFa
  }));

   await this.httpcli.post<any>(url, allowancesArray, options)
            .pipe(map(Response => {
              console.log(Response)
              this.getAllowanceData();
              // window.location.reload();
            }))
            .subscribe(() => { }, () => {
            });
    console.log('Saving data:', allowancesArray);
  }

  saveAndContinue() {

    if (this.policyTab == true) {
      this.policyTab = false;
      this.fuelTab = true;
      this.domesticTab = false;
    } else if (this.fuelTab == true) {
      this.policyTab = false;
      this.fuelTab = false;
      this.domesticTab = true;
      this.getAllowanceData();
    } else if (this.domesticTab == true) {
      this.policyTab = false;
      this.fuelTab = false;
      this.domesticTab = true;
      this.saveData();
    }
  }


  async getAllowanceData() {

    var url = GlobalConstants.apiGetAllowance;
    let asyncResult = await firstValueFrom( this.httpcli.get<any[]>(url, {responseType: 'text' as 'json' , withCredentials: true }));
    // this.allowanceData = asyncResult;

    if (asyncResult) {
      try {
        this.allowanceData = this.encdec.decodeData(asyncResult);
      } catch (error) {
        console.error('JSON Parsing Error:', error);
      }
    } else {
      console.error('No data received from the server');
    }

    this.allowance = this.allowanceData.map((item: any) => ({
      selectedGrade: item.GRADE,
      classAPlus: item.HS1 ,
      classA: item.HS2 ,
      classB: item.HS3 ,
      domesticFa: item.DFA ,
      domesticDa: item.DDA ,
      overseasFa: item.OFA ,
      overseasDa: item.ODA ,
    }));

    // console.log(this.allowanceData);
  }




}
