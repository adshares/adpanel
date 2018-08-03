import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { User, LocalStorageUser } from 'models/user.model';
import {Site} from "models/site.model";
import {parseTargetingForBackend} from "common/components/targeting/targeting.helpers";

@Injectable()
export class ApiUsersService {

  constructor(private http: HttpClient) { }

  emailActivate(token: string){
      return this.http.post(`${environment.apiUrl}/users/email/activate`, { user: { email_confirm_token: token } });
  }

  emailActivateResend(uri){
     return this.http.post(`${environment.apiUrl}/users/email/activate/resend`, {uri});
  }

  emailConfirm1Old(token: string){
      return this.http.get(`${environment.apiUrl}/users/email/confirm1Old/${token}`);
  }

  emailConfirm2New(token: string){
      return this.http.get(`${environment.apiUrl}/users/email/confirm2New/${token}`);
  }

  patch(id: number, user): Observable<User> {
      return this.http.patch<User>(`${environment.apiUrl}/users/${id}`, { user });
  }

  patchWithToken(user: object,  token: string) {
     return this.http.patch(`${environment.apiUrl}/users`, { user, token });
  }

  post(user, uri): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, {user, uri});
  }
}
