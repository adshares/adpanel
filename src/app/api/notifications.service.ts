import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { Notification } from 'models/notification.model';

@Injectable()
export class ApiNotificationsService {

  constructor(private http: HttpClient) {
  }

  get(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications`);
  }
}
