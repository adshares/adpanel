import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AdminSettings, UserInfoStats } from '../models/settings.model';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AdminService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserInfoStats[]> {
    return this.http.get<UserInfoStats[]>(`${environment.apiUrl}/users`);
  }

  getAdminSettings(): Observable<AdminSettings> {
    return this.http.get<AdminSettings>(`${environment.apiUrl}/admin_settings`);
  }

  setAdminSettings(newSettings: AdminSettings): Observable<AdminSettings> {
    return this.http.post<AdminSettings>(`${environment.apiUrl}/admin_settings`, { newSettings });
  }
}
