import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  AdminSettings,
  AdminSettingsResponse,
  UserInfoStats
} from 'models/settings.model';
import { environment } from 'environments/environment';
import { adsToClicks } from "common/utilities/helpers";

@Injectable()
export class AdminService {

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<UserInfoStats[]> {
    return this.http.get<UserInfoStats[]>(`${environment.apiUrl}/users`);
  }

  getAdminSettings(): Observable<AdminSettingsResponse> {
    return this.http.get<AdminSettingsResponse>(`${environment.serverUrl}/admin/settings`);
  }

  setAdminSettings(settings: AdminSettings): Observable<AdminSettingsResponse> {
    const formatValues = {
      ...settings,
      hotwalletMaxValue: adsToClicks(settings.hotwalletMaxValue),
      hotwalletMinValue: adsToClicks(settings.hotwalletMinValue),
    };
    return this.http.put<AdminSettingsResponse>(`${environment.serverUrl}/admin/settings`, {settings: formatValues});
  }
}
