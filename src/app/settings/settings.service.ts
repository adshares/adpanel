import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';


@Injectable()
export class SettingsService {

  constructor(private http: Http) {}

  getBillingHistory(): any {
    return this.http.get(`${environment.apiUrl}/billing_history`)
      .map((response: Response) => response.json());
  }

  getNotificationsSettings(): any {
    return this.http.get(`${environment.apiUrl}/notifications_settings`)
      .map((response: Response) => response.json());
  }
}
