import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user`, { email, password });
  }

  registerUser(email: string, password: string) {
    return this.http.put(`${environment.apiUrl}/user`, { email, password });
  }
}
