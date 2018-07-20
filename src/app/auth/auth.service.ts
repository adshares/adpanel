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

  loginUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, { email, password });
  }

  registerUser(user, uri): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, {user, uri});
  }

  checkRecoveryPasswordToken(token: string) {
      return this.http.get(`${environment.apiUrl}/auth/recovery/${token}`);
  }
  getUserData(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/check`);
  }

  remindPassword(email: string, uri: string) {
    return this.http.post(`${environment.apiUrl}/auth/recovery`, { email, uri });
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

  logOut() {
    return this.http.get(`${environment.apiUrl}/auth/logout`);
  }

  confirmOldEmailChange(token: string){
      return this.http.get(`${environment.apiUrl}/users/email/confirm1Old/${token}`);
  }

  confirmNewEmailChange(token: string){
      return this.http.get(`${environment.apiUrl}/users/email/confirm2New/${token}`);
  }

  storeAccountTypeChoice(type: string) {
    localStorage.setItem('accountTypeChoice', type);
  }

  getAccountTypeChoice(): string {
    return localStorage.getItem('accountTypeChoice');
  }

  storeUserSession(user: LocalStorageUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserSession(): LocalStorageUser {
    return JSON.parse(localStorage.getItem('user'));
  }

  dropUserSession() {
    localStorage.removeItem('user');
  }

  isAdmin(): boolean {
    let u = this.getUserSession();
    return u ? (u.isAdmin ? true : false ) : false;
  }

  isAdvertiser(): boolean {
    let u = this.getUserSession();
    return u ? (u.isAdvertiser ? true : false ) : false;
  }

  isPublisher(): boolean {
    let u = this.getUserSession();
    return u ? (u.isPublisher ? true : false ) : false;
  }
}
