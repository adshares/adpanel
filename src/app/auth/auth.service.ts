import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { User, LocalStorageUser } from 'models/user.model';
import {Site} from "models/site.model";
import {parseTargetingForBackend} from "common/components/targeting/targeting.helpers";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }
// guest access
  checkRecoveryPasswordToken(token: string) {
    return this.http.get(`${environment.authUrl}/recovery/${token}`);
  }

  remindPassword(email: string, uri: string) {
    return this.http.post(`${environment.authUrl}/recovery`, { email, uri });
  }

  loginUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.authUrl}/login`, { email, password });
  }
// user access
  getUserData(): Observable<User> {
    return this.http.get<User>(`${environment.authUrl}/check`);
  }

  logOut() {
    return this.http.get(`${environment.authUrl}/logout`);
  }
// token access
  registerUser(user, uri): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, {user, uri});
  }

  resetPassword(user: object,  uri: string) {
     return this.http.patch(`${environment.apiUrl}/users`, { user, uri });
   }

  emailActivation(token: string){
      return this.http.post(`${environment.apiUrl}/users/email/activate`, { user: { email_confirm_token: token } });
  }

  emailActivationResend(uri){
     return this.http.post(`${environment.apiUrl}/users/email/activate/resend`, {uri});
  }

  saveUsers(id: number, user): Observable<User> {
      return this.http.patch<User>(`${environment.apiUrl}/users/${id}`, { user });
  }

  emailChangeConfirmOld(token: string){
      return this.http.get(`${environment.apiUrl}/users/email/confirm1Old/${token}`);
  }

  emailChangeConfirmNew(token: string){
      return this.http.get(`${environment.apiUrl}/users/email/confirm2New/${token}`);
  }
}
