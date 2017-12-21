import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Campaign } from '../models/campaign.model';
import 'rxjs/add/operator/map';

@Injectable()
export class AdvertiserService {

  constructor(private http: Http) { }

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get(`${environment.apiUrl}/campaigns`)
      .map((response: Response) => response.json());
  }
}
