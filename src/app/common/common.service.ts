import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { AdSharesEthAddress } from 'models/settings.model';

@Injectable()
export class CommonService {

  constructor(private http: HttpClient) { }

  getAdsharesEthAddress(): Observable<AdSharesEthAddress> {
    return this.http.get<AdSharesEthAddress>(`${environment.apiUrl}/adshares_eth_address`);
  }
}
