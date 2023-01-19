import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Campaign } from 'models/campaign.model';
import { AppState } from 'models/app-state.model';
import { LoadCampaign, SetLastEditedCampaign } from 'store/advertiser/advertiser.actions';

@Injectable()
export class CampaignResolver implements Resolve<Campaign> {
  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Campaign> {
    const id = Number(route.params.id);
    const isInEditMode = route.routeConfig.path.includes('edit-campaign');
    this.initCampaignData(id);
    return this.waitForCampaignDataToLoad(id, isInEditMode);
  }

  initCampaignData(id: number): void {
    this.store.dispatch(new LoadCampaign(id));
  }

  waitForCampaignDataToLoad(id: number, isInEditMode: boolean): Observable<Campaign> {
    return this.store.select('state', 'advertiser', 'campaigns').pipe(
      map(campaigns => campaigns.find(campaign => campaign.id === id)),
      filter(campaign => !!campaign),
      tap(campaign => {
        if (isInEditMode) {
          this.store.dispatch(new SetLastEditedCampaign(campaign));
        } else {
          return campaign;
        }
      }),
      take(1)
    );
  }
}
