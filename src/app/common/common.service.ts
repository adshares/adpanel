import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import {
  AccessToken,
  AccessTokenResponse,
  AccessTokenResponseWithSecret,
  AccessTokenScope,
} from 'models/access-token.model';
import { reportType } from 'models/enum/user.enum';
import { Info, Placeholders } from 'models/info.model';
import { PaginatorResponse, RefLink, RefLinkInfo, ReportsList } from 'models/settings.model';
import { Media } from 'models/taxonomy-medium.model';
import { Options } from 'models/options.model';

@Injectable()
export class CommonService {
  constructor(private http: HttpClient) {}

  getInfo(): Observable<Info> {
    return this.http.get<Info>(`${environment.serverUrl}/info`);
  }

  getOptions(): Observable<Options> {
    return this.http.get<Options>(`${environment.serverUrl}/api/options/server`);
  }

  report(type: reportType, dateStart: string, dateEnd: string, id?: number): Observable<any> {
    let options = {};

    if (id > 0) {
      options['params'] = type === reportType.CAMPAIGNS ? { campaign_id: id } : { site_id: id };
    }

    return this.http.get<any>(`${environment.apiUrl}/stats/report/${type}/${dateStart}/${dateEnd}`, options);
  }

  getReportsList(): Observable<ReportsList> {
    return this.http.get<ReportsList>(`${environment.apiUrl}/stats/report/list`);
  }

  getReport(id: string): Observable<any> {
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'json',
    };

    return this.http.get<any>(`${environment.apiUrl}/stats/report/${id}`, options);
  }

  getRefLinks(pageUrl: string | undefined): Observable<PaginatorResponse<RefLink>> {
    const url =
      undefined === pageUrl
        ? `${environment.apiUrl}/ref-links`
        : (pageUrl && environment.serverUrl.startsWith('https:') && pageUrl.replace(/^http:/, 'https:')) || pageUrl;
    return this.http.get<PaginatorResponse<RefLink>>(url);
  }

  saveRefLink(refLink: object): Observable<RefLink> {
    return this.http.post<RefLink>(`${environment.apiUrl}/ref-links`, {
      refLink,
    });
  }

  getRefLinkInfo(token: string): Observable<RefLinkInfo> {
    return this.http.get<RefLinkInfo>(`${environment.apiUrl}/ref-links/info/${token}`);
  }

  deleteRefLink(refLinkId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/ref-links/${refLinkId}`);
  }

  getMedia(): Observable<Media> {
    return this.http.get<Media>(`${environment.apiUrl}/options/campaigns/media`);
  }

  getLoginPlaceholders(): Observable<Placeholders> {
    return this.http.get<Placeholders>(`${environment.serverUrl}/panel/placeholders/login`);
  }

  getAccessTokenScopes(): Observable<AccessTokenScope[]> {
    return this.http.get<AccessTokenScope[]>(`${environment.authUrl}/scopes`);
  }

  getAccessTokens(): Observable<AccessTokenResponse[]> {
    return this.http.get<AccessTokenResponse[]>(`${environment.authUrl}/personal-access-tokens`);
  }

  addAccessToken(token: AccessToken): Observable<AccessTokenResponseWithSecret> {
    return this.http.post<AccessTokenResponseWithSecret>(`${environment.authUrl}/personal-access-tokens`, token);
  }

  deleteAccessToken(id: string): Observable<null> {
    return this.http.delete<null>(`${environment.authUrl}/personal-access-tokens/${id}`);
  }
}
