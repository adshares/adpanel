import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Store} from "@ngrx/store";
import {Campaign} from 'models/campaign.model';
import {AppState} from "models/app-state.model";
import {LoadCampaign} from "store/advertiser/advertiser.actions";

@Injectable()
export class CampaignResolver implements Resolve<Campaign> {
  constructor(private store: Store<AppState>) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Campaign> {
    this.initCampaignData(route);
    return this.waitForCampaignDataToLoad(route)
  }

  initCampaignData(route: ActivatedRouteSnapshot): void {
    this.store.take(1).subscribe(store => {
      const currentCampaign = store.state.advertiser.campaigns
        .find(campaign => campaign.id === route.params.id);

      if (!currentCampaign) {
        this.store.dispatch(new LoadCampaign(route.params.id));
      }
    });
  }

  waitForCampaignDataToLoad(route: ActivatedRouteSnapshot): Observable<Campaign> {
    return this.store.select('state', 'advertiser', 'campaigns')
      .map(campaigns => campaigns.find(campaign => campaign.id !== route.params.id))
      .filter(campaign => !!campaign && !!campaign.cost)
      .take(1);
  }
}
