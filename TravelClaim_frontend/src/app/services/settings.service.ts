import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../shared/common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor( private http:HttpClient) {   }

  
  getSettingList(id:number){
    let url = GlobalConstants.apiGetSettingList;
    const param = new HttpParams()
    .set('id', id);
    let headers = new HttpHeaders();
    const options = { headers, params: param, withCredentials: true, responseType: 'text' as 'json' }
    headers.set('Content-Type', 'application/json');
    return this.http.get<any>(url,options);
  }
  getActiveSettingList(id:number){
    let url = GlobalConstants.apiGetActiveSettingList;
    const param = new HttpParams()
    .set('id', id);
    let headers = new HttpHeaders();
    const options = { headers, params: param, withCredentials: true, responseType: 'text' as 'json' }
    headers.set('Content-Type', 'application/json');
    return this.http.get<any>(url,options);
  }

  insertGlobalSettingData(id:number, name:string){
    const param = new HttpParams()
    .set('id', id)
    .set('name', name);
    let headers = new HttpHeaders();
    const options = { headers, params: param, withCredentials: true }
    headers.set('Content-Type', 'application/json');
    let url = GlobalConstants.apiInsertGlobalSettingData;
    return this.http.post<string>(url, null, options);
  }

  updateGlobalSettingData(settingId:number,tableId:number,name: string, isActive: string) {
    const param = new HttpParams()
      .set('settingId',settingId)
      .set('tableId',tableId)
      .set('name', name)
      .set('isActive', isActive);
  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
  
    const options = { headers, params: param, withCredentials: true };
    const url = GlobalConstants.apiUpdateGlobalSettingData;
  
    return this.http.put<string>(url, null, options);
  }

  // updateIDepartment(id:number,Dept: string, isActive: string) {
  //   const param = new HttpParams()
  //     .set('id',id)
  //     .set('Dept', Dept)
  //     .set('isActive', isActive);
  
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Content-Type', 'application/json');
  
  //   const options = { headers, params: param, withCredentials: true };
  //   const url = GlobalConstants.apiUpdateIDepartment;
  
  //   return this.http.put<string>(url, null, options);
  // }

  // updateIDesignation(id:number,Desg: string, isActive: string) {
  //   const param = new HttpParams()
  //   .set('id',id)
  //     .set('Desg', Desg)
  //     .set('isActive', isActive);
  
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Content-Type', 'application/json');
  
  //   const options = { headers, params: param, withCredentials: true };
  //   const url = GlobalConstants.apiUpdateIDesignation;
  
  //   return this.http.put<string>(url, null, options);
  // }
  
  // updateIshidaLocation(id:number,location: string, isActive: string) {
  //   const param = new HttpParams()
  //   .set('id',id)
  //     .set('location', location)
  //     .set('isActive', isActive);
  
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Content-Type', 'application/json');
  
  //   const options = { headers, params: param, withCredentials: true };
  //   const url = GlobalConstants.apiUpdateIshidaLocation;
  
  //   return this.http.put<string>(url, null, options);
  // }

  updateIGrade(sn:number,grade: string, isActive: string) {
    const param = new HttpParams()
    .set('sn',sn)
      .set('grade', grade)
      .set('isActive', isActive);
  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
  
    const options = { headers, params: param, withCredentials: true };
    const url = GlobalConstants.apiUpdateIGrade;
  
    return this.http.put<string>(url, null, options);
  }

  // updateIEmptSts(id:number,empt: string, isActive: string) {
  //   const param = new HttpParams()
  //   .set('id',id)
  //     .set('empt', empt)
  //     .set('isActive', isActive);
  
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Content-Type', 'application/json');
  
  //   const options = { headers, params: param, withCredentials: true };
  //   const url = GlobalConstants.apiUpdateIEmptSts;
  
  //   return this.http.put<string>(url, null, options);
  // }

  // updateIRole(id:number,role: string, isActive: string) {
  //   const param = new HttpParams()
  //   .set('id',id)
  //     .set('role', role)
  //     .set('isActive', isActive);
  
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Content-Type', 'application/json');
  
  //   const options = { headers, params: param, withCredentials: true };
  //   const url = GlobalConstants.apiUpdateIRole;
  
  //   return this.http.put<string>(url, null, options);
  // }

}
