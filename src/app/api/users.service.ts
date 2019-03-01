import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { User } from 'models/user.model';

@Injectable()
export class ApiUsersService {

  constructor(private http: HttpClient) {
  }

  // user access

  emailActivateResend(uri) {
    return this.http.post(`${environment.authUrl}/email/activate/resend`, {uri});
  }

  emailConfirm1Old(token: string) {
    return this.http.get(`${environment.authUrl}/email/confirm1Old/${token}`);
  }

  emailConfirm2New(token: string) {
    return this.http.get(`${environment.authUrl}/email/confirm2New/${token}`);
  }

  emailActivate(token: string) {
    return this.http.post(`${environment.authUrl}/email/activate`, {user: {email_confirm_token: token}});
  }

  confirmWithdrawal(token: string) {
    return this.http.post(`${environment.apiUrl}/wallet/confirm-withdrawal`, {token: token});
  }

  updateSelf(id: number, user): Observable<User> {
    return this.http.patch<User>(`${environment.authUrl}/self`, {user});
  }

  // guest access

  resetPassword(user: object, token: string) {
    return this.http.patch(`${environment.authUrl}/password`, {user, token});
  }

  register(user, uri): Observable<User> {
    return this.http.post<User>(`${environment.authUrl}/register`, {user, uri});
  }
}
