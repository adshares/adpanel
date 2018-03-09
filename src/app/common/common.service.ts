import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Injectable()
export class CommonService {

  constructor(private http: HttpClient) { }

  getAdsharesEthAddress(): Observable<string> {
    return this.http.get<string>(`${environment.apiUrl}/adshares_eth_user`);
  }
}
