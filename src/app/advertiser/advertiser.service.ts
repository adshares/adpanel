import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Campaign } from '../models/campaign.model';

@Injectable()
export class AdvertiserService {

  constructor(private http: Http) {}

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get(`${environment.apiUrl}/campaigns`)
      .map((response: Response) => response.json());
  }
  getCampaign(id): Observable<Campaign> {
    return this.http.get(`${environment.apiUrl}/campaign/${id}`)
      .map((response: Response) => response.json());
  }
}
