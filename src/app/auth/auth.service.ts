import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { UserModel } from './store/user.model';

@Injectable()
export class AuthService {

  constructor(private http: Http) { }

  loginUser(email: string, password: string): Observable<UserModel> {
    return this.http.post(`${environment.apiUrl}/user`, { email, password })
      .map((response: Response) => {
          const result: UserModel = response.json();

          return result;
      });
  }

  registerUser(email: string, password: string) {
    return this.http.put(`${environment.apiUrl}/user`, { email, password });
  }
}
