import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { Notification } from 'models/notification.model';
import { reportType } from 'models/enum/user.enum';
import { ReportsList } from 'models/settings.model';
import { Info } from "models/info.model";

@Injectable()
export class CommonService {

  constructor(private http: HttpClient) {
  }

  getInfo(): Observable<Info> {
    return this.http.get<Info>(`${environment.serverUrl}/info`);
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications`);
  }

  dismissNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(`${environment.apiUrl}/dismiss_notification`, notification);
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
}
