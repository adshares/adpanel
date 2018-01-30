import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { Campaign } from '../models/campaign.model';
import { TargetingOption } from '../models/targeting-option.model';
import 'rxjs/add/operator/map';

@Injectable()
export class AdvertiserService {

  constructor(private http: HttpClient) { }

  getCampaigns(userId: number): Observable<Campaign[]> {
    return this.http.get(`${environment.apiUrl}/campaigns/${userId}`)
      .map((campaigns: Campaign[]) => campaigns);
  }

  getCampaign(id: number): Observable<Campaign> {
    return this.http.get(`${environment.apiUrl}/campaign/${id}`)
      .map((campaign: Campaign) => campaign);
  }

  deleteAdImage(adId: number) {
    return this.http.delete(`${environment.apiUrl}/ad/${adId}`);
  }

  saveCampaign(campaign: Campaign): Observable<Campaign> {
    return this.http.put(`${environment.apiUrl}/campaign`, { campaign })
      .map((campaign: Campaign) => campaign);
  }

  getTargetingCriteria(): Observable<TargetingOption[]> {
    return this.http.get(`${environment.apiUrl}/campaign_targeting`)
      .map((targetingOption: TargetingOption[]) => targetingOption);
  }
}
