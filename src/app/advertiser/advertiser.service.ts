import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { environment } from '../../environments/environment';
import { Campaign } from '../models/campaign.model';
import { TargetingOption } from '../models/targeting-option.model';
import { prepareTargetingChoices, parseTargetingForBackend } from '../common/components/targeting/targeting.helpers';
import { cloneDeep } from '../common/utilities/helpers';

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
    const targetingObject = parseTargetingForBackend(campaign.targetingArray);

    Object.assign(campaign, {targeting: targetingObject});

    return this.http.put(`${environment.apiUrl}/campaign`, { campaign })
      .map((campaign: Campaign) => campaign);
  }

  getTargetingCriteria(): Observable<TargetingOption[]> {
    return this.http.get(`${environment.apiUrl}/campaign_targeting`)
      .do(prepareTargetingChoices);
  }
}
