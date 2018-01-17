import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {

  constructor(private http: Http) { }

  loginUser(email: string, password: string): Observable<User> {
    return this.http.post(`${environment.apiUrl}/user`, { email, password })
      .map((response: Response) => response.json());
  }

  registerUser(email: string, password: string) {
    return this.http.put(`${environment.apiUrl}/user`, { email, password });
  }
}
