import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  AdminPrivacyAndTermsSettingsResponse,
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

  getUsers(nextPage?: string): Observable<UserInfoStats[]> {
    const url = (nextPage && nextPage.replace('http', 'https')) ||
      `${environment.serverUrl}/admin/users`;
    return this.http.get<UserInfoStats[]>(url);
  }

  impersonateUser(id: number): Observable<string> {
    return this.http.get<string>(`${environment.serverUrl}/admin/impersonation/${id}`)
  }

  getAdminSettings(): Observable<AdminSettingsResponse> {
    return this.http.get<AdminSettingsResponse>(`${environment.serverUrl}/admin/settings`);
  }

  getTermsAndConditions(): Observable<AdminPrivacyAndTermsSettingsResponse> {
    return this.http.get<AdminPrivacyAndTermsSettingsResponse>(`${environment.serverUrl}/admin/terms`);
  }

  setTermsAndConditions(content): Observable<string> {
    return this.http.put<string>(`${environment.serverUrl}/admin/terms`, {content});
  }

  getPrivacySettings(): Observable<AdminPrivacyAndTermsSettingsResponse> {
    return this.http.get<AdminPrivacyAndTermsSettingsResponse>(`${environment.serverUrl}/admin/privacy`);
  }

  setPrivacySettings(content): Observable<string> {
    return this.http.put<string>(`${environment.serverUrl}/admin/privacy`, {content});
  }

  setAdminSettings(settings: AdminSettings): Observable<AdminSettingsResponse> {
    const formatValues = {
      ...settings,
      advertiserCommission: settings.advertiserCommission / 100,
      publisherCommission: settings.publisherCommission / 100,
      hotwalletMaxValue: adsToClicks(settings.hotwalletMaxValue),
      hotwalletMinValue: adsToClicks(settings.hotwalletMinValue),
    };
    return this.http.put<AdminSettingsResponse>(`${environment.serverUrl}/admin/settings`, {settings: formatValues});
  }

  getLicense(): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/admin/license`);
  }
}
