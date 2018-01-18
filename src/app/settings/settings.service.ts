import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class SettingsService {

  constructor(private http: HttpClient) {}

  getBillingHistory(userId): Observable<any> {
    return this.http.get(`${environment.apiUrl}/billing_history/${userId}`);
  }

  getNotificationsSettings(userId): Observable<any> {
    return this.http.get(`${environment.apiUrl}/notifications_settings/${userId}`);
  }

  updateNotificationsSettings(newSettings: object) {
    this.http.put(`${environment.apiUrl}/notifications_settings`, newSettings);
  }

}
