import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { AdsharesAddress, DepositInfo } from 'models/settings.model';

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
}
