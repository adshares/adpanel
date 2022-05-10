import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AdminIndexUpdateTimeResponse,
  AdminPrivacyAndTermsSettingsResponse,
  AdminSettings,
  AdminSettingsResponse, AdminSiteOptions, AdminSiteOptionsResponse,
  AdminWalletResponse,
  AdvertiserInfo,
  PublisherInfo,
  RejectedDomainsResponse,
  UserBanDetails,
  UserInfo
} from 'models/settings.model'
import { environment } from 'environments/environment';
import { adsToClicks, buildUrl } from 'common/utilities/helpers'

@Injectable()
export class AdminService {

  constructor(private http: HttpClient) {
  }

  getUsers(nextPage?: string, searchPhrase?: string, filters: string[] = [], orderBy?: string, direction?: string): Observable<UserInfo[]> {
    const url = (
      nextPage && (environment.serverUrl.search(/^https:/) >= 0 && nextPage.replace(/^http:/, 'https:'))
      || nextPage
    ) || `${environment.serverUrl}/admin/users`;
    const params = [];
    if (searchPhrase) {
      params.push('q=' + encodeURIComponent(searchPhrase));
    }
    filters.forEach(filter => {
      params.push('f[]=' + encodeURIComponent(filter));
    });
    if (orderBy) {
      params.push('o=' + encodeURIComponent(orderBy));
    }
    if (direction) {
      params.push('d=' + encodeURIComponent(direction));
    }
    return this.http.get<UserInfo[]>(buildUrl(url, params));
  }

  getAdvertisers(groupBy?: string, interval?: string, searchPhrase?: string, minDailyViews?: number): Observable<AdvertiserInfo[]> {
    const params = [];
    if (groupBy) {
      params.push('g=' + encodeURIComponent(groupBy));
    }
    if (interval) {
      params.push('i=' + encodeURIComponent(interval));
    }
    if (searchPhrase) {
      params.push('q=' + encodeURIComponent(searchPhrase));
    }
    if (minDailyViews !== null) {
      params.push('l=' + minDailyViews);
    }
    return this.http.get<AdvertiserInfo[]>(buildUrl(`${environment.serverUrl}/admin/advertisers`, params));
  }

  getPublishers(groupBy?: string, interval?: string, searchPhrase?: string, minDailyViews?: number): Observable<PublisherInfo[]> {
    const params = [];
    if (groupBy) {
      params.push('g=' + encodeURIComponent(groupBy));
    }
    if (interval) {
      params.push('i=' + encodeURIComponent(interval));
    }
    if (searchPhrase) {
      params.push('q=' + encodeURIComponent(searchPhrase));
    }
    if (minDailyViews !== null) {
      params.push('l=' + minDailyViews);
    }
    return this.http.get<PublisherInfo[]>(buildUrl(`${environment.serverUrl}/admin/publishers`, params));
  }

  confirmUser(id: number): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${environment.serverUrl}/admin/users/${id}/confirm`, {})
  }

  switchToModerator(id: number): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${environment.serverUrl}/admin/users/${id}/switchToModerator`, {})
  }

  switchToAgency(id: number): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${environment.serverUrl}/admin/users/${id}/switchToAgency`, {})
  }

  switchToRegular(id: number): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${environment.serverUrl}/admin/users/${id}/switchToRegular`, {})
  }

  impersonateUser(id: number): Observable<string> {
    return this.http.get<string>(`${environment.serverUrl}/admin/impersonation/${id}`)
  }

  getAdminSettings(): Observable<AdminSettingsResponse> {
    return this.http.get<AdminSettingsResponse>(`${environment.serverUrl}/admin/settings`);
  }

  getAdminSiteOptions(): Observable<AdminSiteOptionsResponse> {
    return this.http.get<AdminSiteOptionsResponse>(`${environment.apiUrl}/options/sites`);
  }

  getAdminWallet(): Observable<AdminWalletResponse> {
    return this.http.get<AdminWalletResponse>(`${environment.serverUrl}/admin/wallet`);
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
      referralRefundCommission: settings.referralRefundCommission / 100,
      hotwalletMaxValue: adsToClicks(settings.hotwalletMaxValue),
      hotwalletMinValue: adsToClicks(settings.hotwalletMinValue),
    };
    return this.http.put<AdminSettingsResponse>(`${environment.serverUrl}/admin/settings`, {settings: formatValues});
  }

  setAdminSiteOptions(options: AdminSiteOptions): Observable<AdminSiteOptionsResponse> {
    return this.http.patch<AdminSiteOptionsResponse>(`${environment.serverUrl}/admin/site-settings`, {...options});
  }

  getLicense(): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/admin/license`);
  }

  getIndexUpdateTime(): Observable<AdminIndexUpdateTimeResponse> {
    return this.http.get<AdminIndexUpdateTimeResponse>(`${environment.serverUrl}/admin/index/update-time`);
  }

  getPanelPlaceholders(types: string[]): Observable<any> {
    let params = new HttpParams();
    types.forEach(type => {
      params = params.append('types[]', type);
    });

    return this.http.get<any>(`${environment.serverUrl}/panel/placeholders`, {params});
  }

  patchPanelPlaceholders(placeholders): Observable<any> {
    return this.http.patch<any>(`${environment.serverUrl}/admin/panel-placeholders`, placeholders);
  }

  getRejectedDomains(): Observable<RejectedDomainsResponse> {
    return this.http.get<RejectedDomainsResponse>(`${environment.serverUrl}/admin/rejected-domains`);
  }

  putRejectedDomains(domains: string[]): Observable<any> {
    return this.http.put<any>(`${environment.serverUrl}/admin/rejected-domains`, {domains});
  }

  banUser(userBanDetails: UserBanDetails): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${environment.serverUrl}/admin/users/${userBanDetails.id}/ban`, { reason: userBanDetails.reason })
  }

  unbanUser(id: UserBanDetails['id']): Observable<UserInfo> {
    return this.http.post<any>(`${environment.serverUrl}/admin/users/${id}/unban`, {})
  }

  deleteUser(id:UserBanDetails['id']): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl}/admin/users/${id}/delete`, {})
  }
}
