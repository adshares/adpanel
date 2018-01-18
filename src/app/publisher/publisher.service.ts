import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Site } from '../models/site.model';


@Injectable()
export class PublisherService {

  constructor(private http: Http) {}

  getSites(userId: number): Observable<Site[]> {
    return this.http.get(`${environment.apiUrl}/sites/${userId}`)
      .map((response: Response) => response.json());
  }

  getSite(id: number): Observable<Site> {
    return this.http.get(`${environment.apiUrl}/site/${id}`)
      .map((response: Response) => response.json());
  }
}
