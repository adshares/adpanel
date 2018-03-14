import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { User } from 'models/user.model';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  loginUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/user`, { email, password });
  }

  registerUser(email: string, password: string): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/user`, { email, password });
  }

  sendActivationEmail() {
    return this.http.post(`${environment.apiUrl}/send_activation_email`, { });
  }

  getUserData(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user`);
  }

  remindPassword(email: string) {
    return this.http.post(`${environment.apiUrl}/remind_password`, { email })
  }
}
