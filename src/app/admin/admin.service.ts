import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminSettingsResponse, AdvertiserInfo, PublisherInfo, UserInfo } from 'models/settings.model';
import { environment } from 'environments/environment';
import { buildUrl } from 'common/utilities/helpers';

@Injectable()
export class AdminService {
  constructor(private http: HttpClient) {}

  getUsers(
    nextPage?: string,
    searchPhrase?: string,
    filters: string[] = [],
    orderBy?: string,
    direction?: string
  ): Observable<UserInfo[]> {
    const url =
      (nextPage && environment.serverUrl.search(/^https:/) >= 0 && nextPage.replace(/^http:/, 'https:')) ||
      nextPage ||
      `${environment.serverUrl}/admin/users`;
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

  getAdvertisers(
    groupBy?: string,
    interval?: string,
    searchPhrase?: string,
    minDailyViews?: number
  ): Observable<AdvertiserInfo[]> {
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

  getPublishers(
    groupBy?: string,
    interval?: string,
    searchPhrase?: string,
    minDailyViews?: number
  ): Observable<PublisherInfo[]> {
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

  impersonateUser(id: number): Observable<string> {
    return this.http.get<string>(`${environment.serverUrl}/admin/impersonation/${id}`);
  }

  getAdminSettings(): Observable<AdminSettingsResponse> {
    return this.http.get<AdminSettingsResponse>(`${environment.serverUrl}/admin/settings`);
  }

  getLicense(): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/admin/license`);
  }
}
