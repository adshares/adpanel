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

  // user access

  check(): Observable<User> {
    return this.http.get<User>(`${environment.authUrl}/check`);
  }

  logout() {
    return this.http.get(`${environment.authUrl}/logout`);
  }

  // guest access

  recoveryGet(token: string) {
    return this.http.get(`${environment.authUrl}/recovery/${token}`);
  }

  recoveryPost(email: string, uri: string) {
    return this.http.post(`${environment.authUrl}/recovery`, { email, uri });
  }

  // ANY access
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.authUrl}/login`, { email, password });
  }

}
