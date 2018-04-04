import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { environment } from 'environments/environment';
import { Campaign } from 'models/campaign.model';
import { TargetingOption } from 'models/targeting-option.model';
import {
  prepareTargetingChoices,
  parseTargetingForBackend
} from 'common/components/targeting/targeting.helpers';

@Injectable()
export class AdvertiserService {

  constructor(private http: HttpClient) { }

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get(`${environment.apiUrl}/campaigns`)
      .map((campaigns: Campaign[]) => campaigns);
  }

  getCampaign(id: number): Observable<Campaign> {
    return this.http.get(`${environment.apiUrl}/campaign/${id}`)
      .map((campaign: Campaign) => campaign);
  }

  deleteAdImage(adId: number) {
    return this.http.post(`${environment.apiUrl}/delete_ad`, { adId });
  }

  saveCampaign(campaign: Campaign): Observable<Campaign> {
    if (campaign.targetingArray) {
      const targetingObject = parseTargetingForBackend(campaign.targetingArray);

      Object.assign(campaign, {targeting: targetingObject});
    }

    return this.http.post(`${environment.apiUrl}/save_campaign`, { campaign })
      .map((campaign: Campaign) => campaign);
  }

  updateCampaignStatus(id: string, status: number) {
    return this.http.post(`${environment.apiUrl}/update_campaign_status`, {id, status})
  }

  getTargetingCriteria(): Observable<TargetingOption[]> {
    return this.http.get(`${environment.apiUrl}/campaign_targeting`)
      .do(prepareTargetingChoices);
  }
}
