import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { AdsharesAddress } from 'models/settings.model';
import { Notifications } from 'models/notifications-model';

@Injectable()
export class CommonService {

  constructor(private http: HttpClient) { }

  getAdsharesAddress(): Observable<AdsharesAddress> {
    return this.http.get<AdsharesAddress>(`${environment.apiUrl}/adshares_address`);
  }

  getNotifications(): Observable<Notifications> {
    return this.http.get<Notifications>(`${environment.apiUrl}/notifications_list`);
  }
}
