import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import {
  Campaign,
  CampaignConversionStatistics,
  CampaignsConfig,
  CampaignTotalsResponse
} from 'models/campaign.model';
import { AssetTargeting, TargetingReachResponse } from 'models/targeting-option.model';
import { parseTargetingForBackend } from 'common/components/targeting/targeting.helpers';
import { NavigationStart, Router } from '@angular/router';
import { ClearLastEditedCampaign } from 'store/advertiser/advertiser.actions';
import { AppState } from 'models/app-state.model';
import { Media, Medium } from 'models/taxonomy-medium.model'
import { campaignInitialState } from 'models/initial-state/campaign'

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

  getCampaign(id: number): Observable<{ campaign: Campaign }> {
    return this.http.get<{ campaign: Campaign }>(`${environment.apiUrl}/campaigns/${id}`);
  }

  getCampaignConversionsStatistics(dateStart: string, dateEnd: string, campaignId?: number): Observable<CampaignConversionStatistics[]> {
    const options = campaignId && {
      params: {campaign_id: `${campaignId}`}
    };

    return this.http.get<CampaignConversionStatistics[]>(`${environment.apiUrl}/campaigns/stats/kw/${dateStart}/${dateEnd}`, options);
  }

  cloneCampaign(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${environment.apiUrl}/campaigns/${id}/clone`, {});
  }

  deleteCampaign(id: number): Observable<Campaign> {
    return this.http.delete<Campaign>(`${environment.apiUrl}/campaigns/${id}`);
  }

  saveCampaign (campaign: Campaign): Observable<Campaign> {
    AdvertiserService.convertCampaignForBackend(campaign)
    return this.http.post<Campaign>(`${environment.apiUrl}/campaigns`, { campaign })
  }

  updateCampaign (campaign: Campaign): Observable<null> {
    AdvertiserService.convertCampaignForBackend(campaign)
    return this.http.patch<null>(`${environment.apiUrl}/campaigns/${campaign.id}`, { campaign })
  }

  private static convertCampaignForBackend (campaign: Campaign) {
    if (campaign.targetingArray) {
      campaign.targeting = parseTargetingForBackend(campaign.targetingArray, campaign.basicInformation.vendor)
      delete campaign.targetingArray
    }
  }

  updateStatus(id: number, status: number) {
    const body = {
      campaign: {
        status
      }
    };
    return this.http.put(`${environment.apiUrl}/campaigns/${id}/status`, body);
  }

  activateOutdatedCampaign(id: number) {
    return this.http.patch(`${environment.apiUrl}/campaigns/${id}/activate-outdated`, null);
  }

  getCampaignsConfig(): Observable<CampaignsConfig> {
    return this.http.get<CampaignsConfig>(`${environment.apiUrl}/options/campaigns`);
  }

  getMedium(medium: string = 'web', vendor: string | null = null, excludeInternal: boolean = false): Observable<Medium> {
    let url = `${environment.apiUrl}/options/campaigns/media/${medium}?e=${excludeInternal ? 1 : 0}`
    if (vendor) {
      url = `${url}&vendor=${vendor}`
    }
    return this.http.get<Medium>(url);
  }

  getMediumVendors(medium: string): Observable<Media> {
    return this.http.get<Media>(`${environment.apiUrl}/options/campaigns/media/${medium}/vendors`);
  }

  getTargetingReach(sizes: string[], targetingArray?: AssetTargeting, vendor?: string | null): Observable<TargetingReachResponse> {
    const body = {
      targeting: targetingArray ? parseTargetingForBackend(targetingArray, vendor) : campaignInitialState.targeting,
    };
    if (sizes.length > 0) {
      body.targeting.requires['size'] = sizes;
    }

    return this.http.post<TargetingReachResponse>(`${environment.apiUrl}/options/campaigns/targeting-reach`, body);
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
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => this.store.dispatch(new ClearLastEditedCampaign()));
  }
}
