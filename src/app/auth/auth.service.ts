import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  constructor(private http: Http) { }

  loginUser(email: string, password: string) {
    return this.http.post(`${environment.apiUrl}/user`, { email, password });
  }

  registerUser(email: string, password: string) {
    // http TODO
    return this.http.put(`${environment.apiUrl}/user`, { email, password });
  }
}
