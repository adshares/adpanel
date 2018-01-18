import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { BillingHistoryItem } from '../models/billing-history-item.model';
import { NotificationSetting } from '../models/notification-setting.model';


@Injectable()
export class SettingsService {

  constructor(private http: Http) {}

  getBillingHistory(): Observable<BillingHistoryItem[]> {
    return this.http.get(`${environment.apiUrl}/billing_history`)
      .map((response: Response) => response.json());
  }

  getNotificationsSettings(): Observable<NotificationSetting[]> {
    return this.http.get(`${environment.apiUrl}/notifications_settings`)
      .map((response: Response) => response.json());
  }

  updateNotificationsSettings(newSettings: object) {
    this.http.put(`${environment.apiUrl}/notifications_settings`, newSettings);
  }

}
