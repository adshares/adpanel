import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { Campaign, CampaignsTotals, Ad } from 'models/campaign.model';
import { TargetingOption } from 'models/targeting-option.model';
import { parseTargetingForBackend } from 'common/components/targeting/targeting.helpers';
import { TimespanFilter } from 'models/chart/chart-filter-settings.model';

@Injectable()
export class AdvertiserService {

  constructor(private http: HttpClient) { }

  getCampaigns(timespan: TimespanFilter): Observable<Campaign[]> {
    return this.http.post<Campaign[]>(`${environment.apiUrl}/campaigns`, { timespan });
  }

  getCampaignsTotals(timespan: TimespanFilter): Observable<CampaignsTotals> {
    return this.http.post<CampaignsTotals>(`${environment.apiUrl}/campaigns/count`, { timespan });
  }

  getCampaign(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${environment.apiUrl}/campaign/${id}`);
  }

  deleteAdImage(id: number, bId: number) {
    return this.http.delete(`${environment.apiUrl}/campaigns/${id}/banner/${bId}`);
  }

  saveCampaign(campaign: Campaign): Observable<Campaign> {
    if (campaign.targetingArray) {
      const targetingObject = parseTargetingForBackend(campaign.targetingArray);

      Object.assign(campaign, {targeting: targetingObject});
    }

    return this.http.post<Campaign>(`${environment.apiUrl}/campaign`, { campaign });
  }

  getTargetingCriteria(): Observable<TargetingOption[]> {
    return this.http.get<TargetingOption[]>(`${environment.apiUrl}/campaign_targeting`);
  }

  patchTargetingCriteria(id: number): Observable<TargetingOption[]> {
    return this.http.get<TargetingOption[]>(`${environment.apiUrl}/campaigns/${id}/targeting`, { TargetingOption });
  }
  saveAd(ad: Ad): Observable<Ad> {
    return this.http.post<Ad>(`${environment.apiUrl}/save_ad`, { ad });
  }
}
