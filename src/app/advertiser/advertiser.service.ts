import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { parseTargetingForBackend } from 'common/components/targeting/targeting.helpers';
import { environment } from 'environments/environment';
import { AppState } from 'models/app-state.model';
import {
  BannersConfig,
  Campaign,
  CampaignConversionStatistics,
  CampaignsConfig,
  CampaignsMediaResponse,
  CampaignTotalsResponse,
} from 'models/campaign.model';
import { adCreativeTypes } from 'models/enum/ad.enum';
import { campaignInitialState } from 'models/initial-state/campaign';
import { AssetTargeting, TargetingReachResponse } from 'models/targeting-option.model';
import { Media, Medium } from 'models/taxonomy-medium.model';
import * as qs from 'qs';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { ClearLastEditedCampaign } from 'store/advertiser/advertiser.actions';

@Injectable()
export class AdvertiserService {
  constructor(private http: HttpClient, private router: Router, private store: Store<AppState>) {}

  uploadBanner(data): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/campaigns/banner`, data, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getCampaigns(filter: any = {}): Observable<Campaign[]> {
    const queryString = qs.stringify(filter);
    return this.http.get<Campaign[]>(`${environment.apiUrl}/campaigns?${queryString}`);
  }

  getCampaignsTotals(
    dateStart: string,
    dateEnd: string,
    campaignId?: number,
    filter: any = {}
  ): Observable<CampaignTotalsResponse> {
    if (campaignId) {
      filter.campaign_id = `${campaignId}`;
    }
    const queryString = qs.stringify(filter);
    return this.http.get<CampaignTotalsResponse>(
      `${environment.apiUrl}/campaigns/stats/table2/${dateStart}/${dateEnd}?${queryString}`
    );
  }

  getCampaign(id: number): Observable<{ campaign: Campaign }> {
    return this.http.get<{ campaign: Campaign }>(`${environment.apiUrl}/campaigns/${id}`).pipe(
      switchMap(response => {
        const directAds = {};
        response.campaign.ads.forEach((ad, index) => {
          if (adCreativeTypes.DIRECT === ad.creativeType) {
            directAds[index] = this.getDirectLinkContent(ad.url);
          }
        });
        if (0 === Object.keys(directAds).length) {
          return of(response);
        }
        return forkJoin(directAds).pipe(
          switchMap(contents => {
            Object.keys(contents).forEach(index => {
              response.campaign.ads[index].creativeContents = contents[index];
            });
            return of(response);
          })
        );
      })
    );
  }

  getDirectLinkContent(url: string): Observable<string> {
    const options = {
      responseType: 'text' as 'json',
    };
    return this.http.get<string>(url, options);
  }

  getCampaignConversionsStatistics(
    dateStart: string,
    dateEnd: string,
    campaignId?: number
  ): Observable<CampaignConversionStatistics[]> {
    const options = campaignId && {
      params: { campaign_id: `${campaignId}` },
    };

    return this.http.get<CampaignConversionStatistics[]>(
      `${environment.apiUrl}/campaigns/stats/kw/${dateStart}/${dateEnd}`,
      options
    );
  }

  cloneCampaign(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${environment.apiUrl}/campaigns/${id}/clone`, {});
  }

  deleteCampaign(id: number): Observable<Campaign> {
    return this.http.delete<Campaign>(`${environment.apiUrl}/campaigns/${id}`);
  }

  saveCampaign(campaign: Campaign): Observable<Campaign> {
    return this.http.post<Campaign>(`${environment.apiUrl}/campaigns`, {
      campaign: AdvertiserService.convertCampaignForBackend(campaign),
    });
  }

  updateCampaign(campaign: Campaign): Observable<null> {
    return this.http.patch<null>(`${environment.apiUrl}/campaigns/${campaign.id}`, {
      campaign: AdvertiserService.convertCampaignForBackend(campaign),
    });
  }

  private static convertCampaignForBackend(campaign: Campaign): Campaign {
    if (campaign.targetingArray) {
      const { targetingArray, ...reducedCampaign } = campaign;
      reducedCampaign.targeting = parseTargetingForBackend(targetingArray, campaign.basicInformation.vendor);
      return reducedCampaign;
    }
    return campaign;
  }

  updateStatus(id: number, status: number) {
    const body = {
      campaign: {
        status,
      },
    };
    return this.http.put(`${environment.apiUrl}/campaigns/${id}/status`, body);
  }

  activateOutdatedCampaign(id: number) {
    return this.http.patch(`${environment.apiUrl}/campaigns/${id}/activate-outdated`, null);
  }

  getBannersConfig(): Observable<BannersConfig> {
    return this.http.get<BannersConfig>(`${environment.apiUrl}/options/banners`);
  }

  getCampaignsConfig(): Observable<CampaignsConfig> {
    return this.http.get<CampaignsConfig>(`${environment.apiUrl}/options/campaigns`);
  }

  getCampaignsMedia(): Observable<CampaignsMediaResponse> {
    return this.http.get<CampaignsMediaResponse>(`${environment.apiUrl}/campaigns/media`);
  }

  getMedium(
    medium: string = 'web',
    vendor: string | null = null,
    excludeInternal: boolean = false
  ): Observable<Medium> {
    let url = `${environment.apiUrl}/options/campaigns/media/${medium}?e=${excludeInternal ? 1 : 0}`;
    if (vendor) {
      url = `${url}&vendor=${vendor}`;
    }
    return this.http.get<Medium>(url);
  }

  getMediumVendors(medium: string): Observable<Media> {
    return this.http.get<Media>(`${environment.apiUrl}/options/campaigns/media/${medium}/vendors`);
  }

  getTargetingReach(
    sizes: string[],
    targetingArray?: AssetTargeting,
    vendor?: string | null
  ): Observable<TargetingReachResponse> {
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
        status,
      },
    };

    return this.http.put(`${environment.apiUrl}/campaigns/${campaignId}/banner/${adId}/status`, body);
  }

  cleanEditedCampaignOnRouteChange(shouldSubscribe: boolean): Subscription {
    return (
      shouldSubscribe &&
      this.router.events
        .pipe(filter(event => event instanceof NavigationStart))
        .subscribe(() => this.store.dispatch(new ClearLastEditedCampaign()))
    );
  }
}
