import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  loginUser(email: string, password: string): Observable<User> {
    return this.http.post(`${environment.apiUrl}/user`, { email, password })
      .map((user: User) => user);
  }

  registerUser(email: string, password: string): Observable<User> {
    return this.http.put(`${environment.apiUrl}/user`, { email, password })
      .map((user: User) => user);
  }

  remindPassword(email: string) {
    return this.http.post(`${environment.apiUrl}/remind_password`, { email })
  }
}
