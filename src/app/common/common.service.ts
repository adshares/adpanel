import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { AdSharesAddress } from 'models/settings.model';

@Injectable()
export class CommonService {

  constructor(private http: HttpClient) { }

  getAdsharesAddress(): Observable<AdSharesAddress> {
    return this.http.get<AdSharesAddress>(`${environment.apiUrl}/adshares_address`);
  }
}
