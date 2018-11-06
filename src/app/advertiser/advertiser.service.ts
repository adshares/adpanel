import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { Ad, Campaign, CampaignsTotals } from 'models/campaign.model';
import { TargetingOption } from 'models/targeting-option.model';
import { parseTargetingForBackend } from 'common/components/targeting/targeting.helpers';
import { TimespanFilter } from 'models/chart/chart-filter-settings.model';

@Injectable()
export class AdvertiserService {

  constructor(private http: HttpClient) {
  }

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${environment.apiUrl}/campaigns`);
  }

  getCampaignsTotals(timespan: TimespanFilter): Observable<CampaignsTotals> {
    return this.http.get<CampaignsTotals>(`${environment.apiUrl}/campaigns/count`);//, { timespan });// FIXME
  }

  getCampaign(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${environment.apiUrl}/campaigns/${id}`);
  }

  deleteAdImage(id: number, bId: number) {
    return this.http.delete(`${environment.apiUrl}/campaigns/${id}/banner/${bId}`);
  }

  deleteCampaign(id: number): Observable<Campaign> {
    return this.http.delete<Campaign>(`${environment.apiUrl}/campaigns/${id}`);
  }

  saveCampaign(campaign: Campaign): Observable<Campaign> {
    if (campaign.targetingArray) {
      const targetingObject = parseTargetingForBackend(campaign.targetingArray);

      Object.assign(campaign, {targeting: targetingObject});
    }

    return this.http.post<Campaign>(`${environment.apiUrl}/campaigns`, {campaign});
  }

  updateCampaign(id: number, campaign: Campaign): Observable<Campaign> {
    if (campaign.targetingArray) {
      const targetingObject = parseTargetingForBackend(campaign.targetingArray);

      Object.assign(campaign, {targeting: targetingObject});
    }

    return this.http.patch<Campaign>(`${environment.apiUrl}/campaigns/${id}`, {campaign});
  }

  classifyCampaign(id: number) {
    return this.http.post(`${environment.apiUrl}/campaigns/${id}/classify`, null);
  }

  updateStatus(id: number, status: number) {
    const body = {
      campaign: {
        status
      }
    };

    return this.http.patch(`${environment.apiUrl}/campaigns/${id}`, body);
  }

  removeClassifyCampaign(id: number) {
      return this.http.delete(`${environment.apiUrl}/campaigns/${id}/classify`);
  }

  getTargetingCriteria(): Observable<TargetingOption[]> {
    return this.http.get<TargetingOption[]>(`${environment.apiUrl}/options/campaigns/targeting`);
  }

  updateTargetingCriterion(id: number, targetingOption: TargetingOption): Observable<TargetingOption[]> {
    return this.http.patch<TargetingOption[]>(`${environment.apiUrl}/campaigns/${id}/targeting`, {targetingOption});
  }

  saveAd(ad: Ad): Observable<Ad> {
    return this.http.post<Ad>(`${environment.apiUrl}/save_ad`, {ad});
  }
}
