import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from 'environments/environment';
import { BillingHistory, CalculateWithdrawalItem, NotificationItem } from 'models/settings.model';
import { User } from "models/user.model";

@Injectable()
export class SettingsService {

  constructor(private http: HttpClient) {
  }

  getBillingHistory(limit?: number, offset?: number): Observable<BillingHistory> {
    let params = {};
    if (limit) {
      params['limit'] = limit.toString();
    }
    if (offset) {
      params['offset'] = offset.toString();
    }

    return this.http.get(`${environment.apiUrl}/wallet/history`, {params: params})
      .map((billingHistory: BillingHistory) => billingHistory);
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
    return this.http.post(`${environment.apiUrl}/change_automatic_withdraw`, {period, amount});
  }

  changeWithdrawAddress(newWithdrawAddress: string) {
    return this.http.patch(`${environment.apiUrl}/wallet/settings`, {newWithdrawAddress});
  }

  calculateWithdrawal(to: string, amount?: number): Observable<CalculateWithdrawalItem> {
    return this.http.post<CalculateWithdrawalItem>(`${environment.apiUrl}/calculate-withdrawal`, {to, amount});
  }

  withdrawFunds(to: string, amount: number, memo: string) {
    return this.http.post(`${environment.apiUrl}/wallet/withdraw`, {to, amount, memo});
  }

  changeEmail(email: string, UriStep1: string, UriStep2: string) {
    return this.http.post(`${environment.authUrl}/email`, {email, UriStep1, UriStep2});
  }

  changePassword(user: object, uri: string) {
    return this.http.patch(`${environment.authUrl}/self`, {user, uri});
  }

  checkUserStatus(): Observable<User> {
    return this.http.get<User>(`${environment.authUrl}/check`);
  }

  cancelAwaitingTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/wallet/cancel-withdrawal/${id}`);
  }
}
