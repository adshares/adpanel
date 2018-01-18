import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Site } from '../models/site.model';


@Injectable()
export class PublisherService {

  constructor(private http: HttpClient) {}

  getSites(userId: number): Observable<Site[]> {
    return this.http.get(`${environment.apiUrl}/sites/${userId}`)
  }

  getSite(id: number): Observable<Site> {
    return this.http.get(`${environment.apiUrl}/site/${id}`);
  }
}
