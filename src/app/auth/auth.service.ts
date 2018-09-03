import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {environment} from 'environments/environment';
import {User} from 'models/user.model';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  // accessed both as guest & user

  emailActivation(token: string) {
    return this.http.post(`${environment.authUrl}/users/email/activate`, {user: {email_confirm_token: token}});
  }

  saveUsers(id: number, user): Observable<User> {
    return this.http.patch<User>(`${environment.authUrl}/users/${id}`, {user});
  }

  emailChangeConfirmOld(token: string) {
    return this.http.get(`${environment.authUrl}/users/email/confirm1Old/${token}`);
  }

  emailChangeConfirmNew(token: string) {
    return this.http.get(`${environment.authUrl}/users/email/confirm2New/${token}`);
  }

  loginUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.authUrl}/login`, { email, password });
  }

  // guest access

  checkRecoveryPasswordToken(token: string) {
    return this.http.get(`${environment.authUrl}/recovery/${token}`);
  }

  remindPassword(email: string, uri: string) {
    return this.http.post(`${environment.authUrl}/recovery`, { email, uri });
  }

  registerUser(user, uri): Observable<User> {
    return this.http.post<User>(`${environment.authUrl}/users`, {user, uri});
  }

  // user access

  getUserData(): Observable<User> {
    return this.http.get<User>(`${environment.authUrl}/check`);
  }

  logOut() {
    return this.http.get(`${environment.authUrl}/logout`);
  }

  emailActivationResend(uri){
    return this.http.post(`${environment.authUrl}/users/email/activate/resend`, {uri});
  }

  // token access

  resetPassword(user: object, uri: string) {
    return this.http.patch(`${environment.apiUrl}/users`, {user, uri});
   }

}
