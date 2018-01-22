import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable()
export class AdminService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(`${environment.apiUrl}/users`);
  }

  getAdminSettings() {
    return this.http.get(`${environment.apiUrl}/admin_settings`);
  }
}
