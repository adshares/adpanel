import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from "@ngrx/store";
import { environment } from 'environments/environment';
import { Campaign, CampaignTotalsResponse } from 'models/campaign.model';
import { TargetingOption } from 'models/targeting-option.model';
import { parseTargetingForBackend } from 'common/components/targeting/targeting.helpers';
import { NavigationStart, Router } from "@angular/router";
import * as advertiserActions from "store/advertiser/advertiser.actions";
import { Subscription } from "rxjs";
import { AppState } from "models/app-state.model";
import {SitesTotals} from "models/site.model";

@Injectable()
export class AdvertiserService {

  constructor(private http: HttpClient, private router: Router, private store: Store<AppState>) {
  }

  uploadBanner(data): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/campaigns/banner`, data, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${environment.apiUrl}/campaigns`);
  }

  getCampaignsTotals(dateStart: string, dateEnd: string, campaignId?: number): Observable<CampaignTotalsResponse> {
    const options = campaignId && {
      params: {campaign_id: `${campaignId}`}
    };
    return this.http.get<CampaignTotalsResponse>(`${environment.apiUrl}/campaigns/stats/table2/${dateStart}/${dateEnd}`, options);
  }

  getCampaign(id: number): Observable<{campaign: Campaign}> {
    return this.http.get<{campaign: Campaign}>(`${environment.apiUrl}/campaigns/${id}`);
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

  updateCampaign(campaign: Campaign): Observable<Campaign> {
    if (campaign.targetingArray) {
      const targetingObject = parseTargetingForBackend(campaign.targetingArray);
      Object.assign(campaign, {targeting: targetingObject});
    }
    return this.http.patch<Campaign>(`${environment.apiUrl}/campaigns/${campaign.id}`, {campaign});
  }

  updateStatus(id: number, status: number) {
    const body = {
      campaign: {
        status
      }
    };
    return this.http.put(`${environment.apiUrl}/campaigns/${id}/status`, body);
  }

  getTargetingCriteria(): Observable<TargetingOption[]> {
    return this.http.get<TargetingOption[]>(`${environment.apiUrl}/options/campaigns/targeting`);
  }

  updateAdStatus(campaignId: number, adId: number, status: number): Observable<Object> {
    const body = {
      banner: {
        status
      }
    };

    return this.http.put(`${environment.apiUrl}/campaigns/${campaignId}/banner/${adId}/status`, body);
  }

  cleanEditedCampaignOnRouteChange(shouldSubscribe: boolean): Subscription {
    return shouldSubscribe && this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(() => this.store.dispatch(new advertiserActions.ClearLastEditedCampaign()));
  }

  report(dateStart: string, dateEnd: string, campaignId?: number): Observable<SitesTotals[]> {
    let options = {
      responseType: 'blob' as 'json'
    };

    if (campaignId > 0) {
      options['params'] = {
        campaign_id: campaignId
      };
    }

    return this.http.get<any>(`${environment.apiUrl}/campaigns/stats/report/${dateStart}/${dateEnd}`, options);
  }
}
