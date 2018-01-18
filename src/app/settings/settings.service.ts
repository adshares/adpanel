import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { BillingHistoryItem, NotificationItem } from '../models/settings.model';


@Injectable()
export class SettingsService {

  constructor(private http: Http) {}

  getBillingHistory(userId): Observable<BillingHistoryItem[]> {
    return this.http.get(`${environment.apiUrl}/billing_history/${userId}`)
      .map((response: Response) => response.json());
  }

  getNotificationsSettings(userId): Observable<NotificationItem[]> {
    return this.http.get(`${environment.apiUrl}/notifications_settings/${userId}`)
      .map((response: Response) => response.json());
  }
}
