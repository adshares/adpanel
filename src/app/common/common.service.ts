import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { environment } from 'environments/environment'
import { reportType } from 'models/enum/user.enum'
import { Info } from 'models/info.model'
import { RefLink, RefLinkInfo, ReportsList } from 'models/settings.model'
import { Media } from 'models/taxonomy-medium.model'

@Injectable()
export class CommonService {

  constructor(private http: HttpClient) {
  }

  getInfo(): Observable<Info> {
    return this.http.get<Info>(`${environment.serverUrl}/info`);
  }

  report(type: reportType, dateStart: string, dateEnd: string, id?: number): Observable<any> {
    let options = {
    };

    if (id > 0) {
      options['params'] = type === reportType.CAMPAIGNS ? {campaign_id: id} : {site_id: id};
    }

    return this.http.get<any>(`${environment.apiUrl}/stats/report/${type}/${dateStart}/${dateEnd}`, options);
  }

  getReportsList(): Observable<ReportsList>{
    return this.http.get<ReportsList>(`${environment.apiUrl}/stats/report/list`);
  }

  getReport(id: string): Observable<any>{
    const options = {
      observe: 'response' as 'body',
      responseType: 'blob' as 'json',
    };

    return this.http.get<any>(`${environment.apiUrl}/stats/report/${id}`, options);
  }

  getRefLinks(): Observable<RefLink[]> {
    return this.http.get<RefLink[]>(`${environment.apiUrl}/ref-links`);
  }

  saveRefLink(refLink: object): Observable<RefLink> {
    return this.http.post<RefLink>(`${environment.apiUrl}/ref-links`, {refLink});
  }

  getRefLinkInfo(token: string): Observable<RefLinkInfo> {
    return this.http.get<RefLinkInfo>(`${environment.apiUrl}/ref-links/info/${token}`);
  }

  getMedia(): Observable<Media> {
    return this.http.get<Media>(`${environment.apiUrl}/options/campaigns/media`);
  }
}
