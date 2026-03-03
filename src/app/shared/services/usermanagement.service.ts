import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CommonServiceService } from './common-service.service';
import { GlobalConstants } from '../common/global-constants';
import { numberOfUserDetails, UserDetails } from './indentdb.type';

@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {

  constructor(private httpcon: HttpClient, private commonService: CommonServiceService) { }

  // it delete user of id pass in the argument. 
  deleteUser(deleteUserId) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const param = new HttpParams().set('userId', deleteUserId);

    const options = { headers };

    return this.httpcon.post<any>(GlobalConstants.apiDeleteUser, param, options)
      .pipe(map(Response => {
        if (Response != 0) {
          this.commonService.toast("success", "User deleted successfully.");
        }
        else {
          this.commonService.toast("error", "There is some error while deletion.");
        }
      }))
  }

  // it update existing user. 
  updateUser(userId: string, password: string, role: string, activeStatus: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const param = new HttpParams()
      .set('userId', userId)
      .set('password', password)
      .set('userRole', role)
      .set('userStatus', activeStatus == "On" ? '1' : '0');

    const options = { headers };
    return this.httpcon.post<any>(GlobalConstants.apiUpdateUser, param, options)
      .pipe(map(Response => {
        return Response;
      }));
  }

  // it add user or register user. 
  addUser(userId: string, userName: string, email: string, password: string, role: string, department: string, designation: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const param = new HttpParams()
      .set('userId', userId)
      .set('userName', userName)
      .set('email', email)
      .set('password', password)
      .set('userRole', role)
      .set('department', department)
      .set('designation', designation);

    const options = { headers };

    return this.httpcon.post<any>(GlobalConstants.apiAddUser, param, options)
      .pipe(map(Response => {
        return Response;
      }))
  }

  // it return number of active and current users.
  getNumberOfUsers() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const options = { headers };
    return this.httpcon.get<numberOfUserDetails>(GlobalConstants.apiNumberOfUsers, options)
      .pipe(map(Response => {
        return Response;
      }));
  }

  // to get the list of users 
  getUserList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const options = { headers };
    return this.httpcon.get<UserDetails>(GlobalConstants.apiListUser)
      .pipe(map(Response => {
        let userDetails: UserDetails[] = [];
        for (const key in Response) {
          if (Response.hasOwnProperty(key)) {
            userDetails.push({ ...Response[key] });
          }
        }
        return userDetails;
      }))
  }

  // it changes password using the userid and new password string.
  changePassword(userId: string, password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const param = new HttpParams()
      .set('userId', userId)
      .set('password', password)

    const options = { headers };

    return this.httpcon.post<any>(GlobalConstants.apiUpdateUserPassword, param, options)
      .pipe(map(Response => {
        return Response;
      }));
  }
}
