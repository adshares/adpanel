import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  AdminIndexUpdateTimeResponse,
  AdminPrivacyAndTermsSettingsResponse,
  AdminSettings,
  AdminSettingsResponse,
  AdminWalletResponse,
  PublisherInfo,
  RejectedDomainsResponse,
  UserInfo
} from 'models/settings.model';
import { environment } from 'environments/environment';
import { adsToClicks } from 'common/utilities/helpers';
import { BidStrategy, BidStrategyRequest } from 'models/campaign.model';
import { TargetingOption } from 'models/targeting-option.model';

@Injectable()
export class AdminService {

  constructor(private http: HttpClient) {
  }

  getUsers(nextPage?: string, searchPhrase: string = ''): Observable<UserInfo[]> {
    const url = (
      nextPage && (environment.serverUrl.search(/^https:/) >= 0 && nextPage.replace(/^http:/, 'https:'))
      || nextPage
    ) || `${environment.serverUrl}/admin/users`;
    const params = searchPhrase.length ? `?q=${searchPhrase}` : '';
    return this.http.get<UserInfo[]>(`${url}${params}`);
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
    if (minDailyViews) {
      params.push('l=' + minDailyViews);
    }
    return this.http.get<PublisherInfo[]>(`${environment.serverUrl}/admin/publishers?${params.join("&")}`);
  }

  impersonateUser(id: number): Observable<string> {
    return this.http.get<string>(`${environment.serverUrl}/admin/impersonation/${id}`)
  }

  getAdminSettings(): Observable<AdminSettingsResponse> {
    return this.http.get<AdminSettingsResponse>(`${environment.serverUrl}/admin/settings`);
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
      hotwalletMaxValue: adsToClicks(settings.hotwalletMaxValue),
      hotwalletMinValue: adsToClicks(settings.hotwalletMinValue),
    };
    return this.http.put<AdminSettingsResponse>(`${environment.serverUrl}/admin/settings`, {settings: formatValues});
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

  getTargetingCriteria(): Observable<TargetingOption[]> {
    return this.http.get<TargetingOption[]>(`${environment.apiUrl}/options/campaigns/targeting`);
  }

  getBidStrategies(): Observable<BidStrategy[]> {
    return this.http.get<BidStrategy[]>(`${environment.apiUrl}/campaigns/bid-strategy`);
  }

  putBidStrategies(bidStrategy: BidStrategyRequest): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/campaigns/bid-strategy`, bidStrategy);
  }

  patchBidStrategies(uuid: string, bidStrategy: BidStrategyRequest): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/campaigns/bid-strategy/${uuid}`, bidStrategy);
  }

  putBidStrategyUuidDefault(uuid: string): Observable<any> {
    return this.http.put<any>(`${environment.serverUrl}/admin/campaigns/bid-strategy/uuid-default`, {uuid});
  }
}
