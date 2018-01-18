import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { BillingHistoryItem, NotificationItem } from '../models/settings.model';


@Injectable()
export class SettingsService {

  constructor(private http: HttpClient) {}

  getBillingHistory(userId): Observable<BillingHistoryItem[]> {
    return this.http.get(`${environment.apiUrl}/billing_history/${userId}`);
  }

  getNotificationsSettings(userId): Observable<NotificationItem[]> {
    return this.http.get(`${environment.apiUrl}/notifications_settings/${userId}`);
  }
}
