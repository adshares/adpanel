import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { User } from 'models/user.model';
import {Site} from "models/site.model";
import {parseTargetingForBackend} from "common/components/targeting/targeting.helpers";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  loginUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, { email, password });
  }

  registerUser(user): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, {user});
  }

  sendActivationEmail() {
    return this.http.post(`${environment.apiUrl}/send_activation_email`, { });
  }

  getUserData(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/check`);
  }

  remindPassword(email: string) {
    return this.http.post(`${environment.apiUrl}/auth/recovery`, { email });
  }

  emailActivation(token: string){
      return this.http.post(`${environment.apiUrl}/users/email/activate`, { user: { email_confirm_token: token } });
  }

  saveUsers(id: number, user): Observable<User> {
      return this.http.patch<User>(`${environment.apiUrl}/users/${id}`, { user });
  }

  logOut() {
    return this.http.get(`${environment.apiUrl}/auth/logout`);
  }
}
