import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { User, LocalStorageUser } from 'models/user.model';
import {Site} from "models/site.model";
import {parseTargetingForBackend} from "common/components/targeting/targeting.helpers";

@Injectable()
export class ApiAuthService {

  constructor(private http: HttpClient) { }

  check(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/check`);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, { email, password });
  }

  logout() {
    return this.http.get(`${environment.apiUrl}/auth/logout`);
  }

  recoveryGet(token: string) {
      return this.http.get(`${environment.apiUrl}/auth/recovery/${token}`);
  }

  recoveryPost(email: string, uri: string) {
    return this.http.post(`${environment.apiUrl}/auth/recovery`, { email, uri });
  }

}
