import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { Campaign } from '../models/campaign.model';
import 'rxjs/add/operator/map';

@Injectable()
export class AdvertiserService {

  constructor(private http: HttpClient) { }

  getCampaigns() {
    return this.http.get(`${environment.apiUrl}/campaigns`);
  }

  getCampaign(id): Observable<Campaign> {
    return this.http.get(`${environment.apiUrl}/campaign/${id}`)
      .map((campaign: Campaign) => campaign);
  }

  deleteAdImage(adId) {
    return this.http.delete(`${environment.apiUrl}/ad/${adId}`);
  }

  saveCampaign(campaign: Campaign) {
    return this.http.put(`${environment.apiUrl}/campaign`, { campaign });
  }
}
