import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { BillingHistoryItem, NotificationItem } from '../models/settings.model';

@Injectable()
export class SettingsService {

  constructor(private http: HttpClient) {}

  getBillingHistory(userId: number): Observable<BillingHistoryItem[]> {
    return this.http.get(`${environment.apiUrl}/billing_history/${userId}`)
      .map((billingHisory: BillingHistoryItem[]) => billingHisory);
  }

  getNotificationsSettings(userId: number): Observable<NotificationItem[]> {
    return this.http.get(`${environment.apiUrl}/notifications_settings/${userId}`)
      .map((notificationSettings: NotificationItem[]) => notificationSettings);
  }

  updateNotificationsSettings(newSettings: NotificationItem[]): Observable<NotificationItem[]> {
    return this.http.put(`${environment.apiUrl}/notifications_settings`, newSettings)
      .map((notificationSettings: NotificationItem[]) => notificationSettings);
  }
}
