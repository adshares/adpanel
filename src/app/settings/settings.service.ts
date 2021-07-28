import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from 'environments/environment';
import {
  BillingHistory,
  CalculateWithdrawalItem,
  NotificationItem,
  RefLink,
} from 'models/settings.model';

@Injectable()
export class SettingsService {

  constructor(private http: HttpClient) {
  }

  getBillingHistory(dateFrom: string, dateTo: string, types: number[], limit?: number, offset?: number): Observable<BillingHistory> {
    let httpParams = new HttpParams({
      fromObject: {
        dateFrom,
        dateTo,
      }
    });

    types.forEach(function (item) {
      httpParams = httpParams.append('types[]', ''+item);
    });

    if (limit) {
      httpParams = httpParams.append('limit', `${limit}`);
    }
    if (offset) {
      httpParams = httpParams.append('offset', `${offset}`);
    }

    return this.http.get(`${environment.apiUrl}/wallet/history?` + httpParams.toString().replace(/\+/gi, '%2B'))
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

  withdrawFunds(to: string, amount: number, memo: string, currency: string = 'ADS') {
    return this.http.post(`${environment.apiUrl}/wallet/withdraw`, {currency, to, amount, memo});
  }

  changeEmail(email: string, UriStep1: string, UriStep2: string) {
    return this.http.post(`${environment.authUrl}/email`, {email, UriStep1, UriStep2});
  }

  changePassword(user: object, uri: string) {
    return this.http.patch(`${environment.authUrl}/self`, {user, uri});
  }

  newsletter(isSubscribed: boolean): Observable<any> {
    return this.http.post(`${environment.authUrl}/newsletter/subscription`, {isSubscribed});
  }

  cancelAwaitingTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/wallet/cancel-withdrawal/${id}`);
  }

  getRefLinks(): Observable<RefLink[]> {
    return this.http.get<RefLink[]>(`${environment.apiUrl}/ref-links`);
  }

  saveRefLink(refLink: object): Observable<RefLink> {
    return this.http.post<RefLink>(`${environment.apiUrl}/ref-links`, {refLink});
  }
}
