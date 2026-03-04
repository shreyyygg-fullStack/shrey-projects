import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from '../shared/common/global-constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }



  login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.http.post(GlobalConstants.apiLogin, body.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      responseType: 'text',
      withCredentials: true, // Ensures cookies (session) are sent
    });
  }

  logout() {
    return this.http.post(GlobalConstants.apiLogout, {}, { withCredentials: true, responseType: 'text' })
  }

  validateToken(token: string): Observable<any> {
    return this.http.get(`${GlobalConstants.apiURL}setting/validate-token?token=${token}`);
  }
}
