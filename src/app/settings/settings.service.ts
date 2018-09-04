import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from 'environments/environment';
import { BillingHistoryItem, NotificationItem } from 'models/settings.model';

@Injectable()
export class SettingsService {

  constructor(private http: HttpClient) { }

  getBillingHistory(): Observable<BillingHistoryItem[]> {
    return this.http.get(`${environment.apiUrl}/wallet/history`)
      .map((billingHisory: BillingHistoryItem[]) => billingHisory);
  }

  getNotificationsSettings(): Observable<NotificationItem[]> {
    return this.http.get(`${environment.apiUrl}/settings/notifications`)
      .map((notificationSettings: NotificationItem[]) => notificationSettings);
  }

  updateNotificationsSettings(newSettings: NotificationItem[]): Observable<NotificationItem[]> {
    return this.http.patch(`${environment.apiUrl}/settings/notifications`, newSettings)
      .map((notificationSettings: NotificationItem[]) => notificationSettings);
  }

  changeAutomaticWithdraw(period: string, amount: number) {
    return this.http.post(`${environment.apiUrl}/change_automatic_withdraw`, { period, amount });
  }

  changeWithdrawAddress(newWithdrawAddress: string) {
    return this.http.patch(`${environment.apiUrl}/wallet/settings`, { newWithdrawAddress });
  }

  withdrawFunds(address: string, amount: number, memo: string) {
    return this.http.post(`${environment.apiUrl}/wallet/withdraw`, { address, amount, memo });
  }

  changeEmail(email: string, URIstep1: string, URIstep2: string) {
    return this.http.post(`${environment.apiUrl}/users/email`, { email, URIstep1, URIstep2 });
  }

  changePassword(user: object, uri: string) {
    return this.http.patch(`${environment.apiUrl}/users`, { user, uri });
  }
}
