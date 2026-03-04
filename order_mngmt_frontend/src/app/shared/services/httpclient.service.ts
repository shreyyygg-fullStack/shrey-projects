import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GlobalConstants } from '../common/global-constants';


export class Login {
  constructor(
    public user_id: string,
    public password: string,
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class HttpclientService {

  USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'

  public user_id: String;
  public password: String;
  usersUrl: string;

  constructor(private httpClient: HttpClient) {
    this.usersUrl = GlobalConstants.apiLoginAdmin;
   }

 // unused
  public findAll(): Observable<Login[]> {
    return this.httpClient.get<Login[]>(this.usersUrl);
  }
 
  // unused
  public save(user: Login) {
    return this.httpClient.post<Login>(this.usersUrl, user);
  }
 
  // unused
  public doLogin(userLogin) {
    return this.httpClient.post<Login>(GlobalConstants.apiLoginAdmin, userLogin);

  }

  // unused
  getEmployee(id: number): Observable<any> {
    return this.httpClient.get(GlobalConstants.apiLoginAdmin);
  }

  // unused
  createEmployee(userLogin: Object): Observable<Object> {
    return this.httpClient.post(GlobalConstants.apiLoginAdmin, userLogin);
  }

  // unused
  public authenticationService(username: String, password: String) {
    return this.httpClient.get(GlobalConstants.apiLoginAdmin,
      { headers: { authorization: this.createBasicAuthToken(this.user_id, password) } }).pipe(map((res) => {
        this.user_id = this.user_id;
        this.password = password;
        this.registerSuccessfulLogin(this.user_id, password);
      }));
  }


  // unused
  createBasicAuthToken(user_id: String, password: String) {
    return 'Basic ' + window.btoa(user_id + ":" + password)
  }

  // unused
  registerSuccessfulLogin(user_id, password) {
    sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, user_id)
  }

  // unused
  logout() {
    sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    this.user_id = null;
    this.password = null;
  }

  // unused
  isUserLoggedIn() {
    let user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME)
    if (user === null) return false
    return true
  }


  // unused
  getLoggedInUserName() {
    let user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME)
    if (user === null) return ''
    return user
  }

}

