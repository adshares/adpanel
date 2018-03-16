import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from 'environments/environment';
import { BillingHistoryItem, NotificationItem } from 'models/settings.model';

@Injectable()
export class SettingsService {

  constructor(private http: HttpClient) { }

  getBillingHistory(): Observable<BillingHistoryItem[]> {
    return this.http.get(`${environment.apiUrl}/billing_history`)
      .map((billingHisory: BillingHistoryItem[]) => billingHisory);
  }

  getNotificationsSettings(): Observable<NotificationItem[]> {
    return this.http.get(`${environment.apiUrl}/notifications_settings`)
      .map((notificationSettings: NotificationItem[]) => notificationSettings);
  }

  updateNotificationsSettings(newSettings: NotificationItem[]): Observable<NotificationItem[]> {
    return this.http.post(`${environment.apiUrl}/update_notifications_settings`, newSettings)
      .map((notificationSettings: NotificationItem[]) => notificationSettings);
  }

  changeEmail(email: string) {
    return this.http.post(`${environment.apiUrl}/change_email`, { email });
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post(`${environment.apiUrl}/change_password`, { currentPassword, newPassword });
  }

  changeAutomaticWithdraw(period: string, amount: number) {
    return this.http.post(`${environment.apiUrl}/change_automatic_withdraw`, { period, amount });
  }

  changeWithdrawAddress(newWithdrawAddress: string) {
    return this.http.post(`${environment.apiUrl}/change_withdraw_address`, { newWithdrawAddress });
  }

  withdrawFunds(address: string, amount: number) {
    return this.http.post(`${environment.apiUrl}/withdraw_funds`, { address, amount });
  }
}
