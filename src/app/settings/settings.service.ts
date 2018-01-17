import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';


@Injectable()
export class SettingsService {

  constructor(private http: HttpClient) {}

  getBillingHistory(): any {
    return this.http.get(`${environment.apiUrl}/billing_history`);
  }

  getNotificationsSettings(): any {
    return this.http.get(`${environment.apiUrl}/notifications_settings`);
  }
}
