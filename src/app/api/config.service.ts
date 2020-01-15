import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { AdsharesAddress, DepositInfo, NowPaymentsInit } from 'models/settings.model';

@Injectable()
export class ApiConfigService {

  constructor(private http: HttpClient) {
  }

  adsharesAddress(): Observable<AdsharesAddress> {
    return this.http.get<AdsharesAddress>(`${environment.apiUrl}/config/adshares-address`);
  }

  depositInfo(): Observable<DepositInfo> {
    return this.http.get<DepositInfo>(`${environment.apiUrl}/deposit-info`);
  }

  nowPaymentsInit(amount: number): Observable<NowPaymentsInit> {
    return this.http.get<NowPaymentsInit>(`${environment.apiUrl}/now-payments/init?amount=`+amount);
  }
}
