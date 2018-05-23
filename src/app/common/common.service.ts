import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { AdsharesAddress } from 'models/settings.model';
import { Notification } from 'models/notification.model';

@Injectable()
export class CommonService {

  constructor(private http: HttpClient) { }

  getAdsharesAddress(): Observable<AdsharesAddress> {
    return this.http.get<AdsharesAddress>(`${environment.apiUrl}/wallet/deposit`);
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications_list`);
  }

  dismissNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(`${environment.apiUrl}/dismiss_notification`, notification);
  }
}
