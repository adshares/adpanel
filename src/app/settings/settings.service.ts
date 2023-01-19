import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { BillingHistory, CalculateWithdrawalItem, Invoice, UserRoles, WalletToken } from 'models/settings.model';
import { User } from 'models/user.model';

@Injectable()
export class SettingsService {
  constructor(private http: HttpClient) {}

  getBillingHistory(
    dateFrom: string,
    dateTo: string,
    types: number[],
    limit?: number,
    offset?: number
  ): Observable<BillingHistory> {
    let httpParams = new HttpParams({
      fromObject: {
        dateFrom,
        dateTo,
      },
    });

    types.forEach(function (item) {
      httpParams = httpParams.append('types[]', '' + item);
    });

    if (limit) {
      httpParams = httpParams.append('limit', `${limit}`);
    }
    if (offset) {
      httpParams = httpParams.append('offset', `${offset}`);
    }

    return this.http
      .get(`${environment.apiUrl}/wallet/history?` + httpParams.toString().replace(/\+/gi, '%2B'))
      .pipe(map((billingHistory: BillingHistory) => billingHistory));
  }

  changeAutomaticWithdraw(period: string, amount: number) {
    return this.http.post(`${environment.apiUrl}/change_automatic_withdraw`, {
      period,
      amount,
    });
  }

  changeWithdrawAddress(newWithdrawAddress: string) {
    return this.http.patch(`${environment.apiUrl}/wallet/settings`, {
      newWithdrawAddress,
    });
  }

  calculateWithdrawal(to: string, amount?: number): Observable<CalculateWithdrawalItem> {
    return this.http.post<CalculateWithdrawalItem>(`${environment.apiUrl}/calculate-withdrawal`, { to, amount });
  }

  withdrawFunds(to: string, amount: number, memo: string, currency: string = 'ADS') {
    return this.http.post(`${environment.apiUrl}/wallet/withdraw`, {
      currency,
      to,
      amount,
      memo,
    });
  }

  changeEmail(email: string, UriStep1: string, UriStep2: string): Observable<User | null> {
    return this.http.post<User | null>(`${environment.authUrl}/email`, {
      email,
      UriStep1,
      UriStep2,
    });
  }

  changePassword(user: object, uri: string): Observable<User> {
    return this.http.patch<User>(`${environment.authUrl}/self`, { user, uri });
  }

  newsletter(isSubscribed: boolean): Observable<any> {
    return this.http.post(`${environment.apiUrl}/newsletter/subscription`, {
      isSubscribed,
    });
  }

  cancelAwaitingTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/wallet/cancel-withdrawal/${id}`);
  }

  saveInvoice(invoice: object): Observable<Invoice> {
    return this.http.post<Invoice>(`${environment.apiUrl}/invoices`, {
      invoice,
    });
  }

  initConnectWallet(): Observable<WalletToken> {
    return this.http.get<WalletToken>(`${environment.apiUrl}/wallet/connect/init`);
  }

  connectWallet(network: string, address: string, token: string, signature: string): Observable<User | null> {
    return this.http.patch<User | null>(`${environment.apiUrl}/wallet/connect`, {
      network,
      address,
      token,
      signature,
      uri: '/auth/connection-confirmation/',
    });
  }

  confirmConnectWallet(token: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/wallet/connect/confirm/${token}`, {});
  }

  changeAutoWithdrawal(autoWithdrawal: number | null): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/wallet/auto-withdrawal`, { autoWithdrawal });
  }

  userRoles(): Observable<UserRoles> {
    return this.http.get<UserRoles>(`${environment.apiUrl}/options/server/default-user-roles`, {});
  }
}
