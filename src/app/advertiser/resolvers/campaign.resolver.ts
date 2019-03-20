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
    const id = Number(route.params.id);

    this.initCampaignData(id);
    return this.waitForCampaignDataToLoad(id)
  }

  initCampaignData(id: number): void {
        this.store.dispatch(new LoadCampaign(id));
  }

  waitForCampaignDataToLoad(id: number): Observable<Campaign> {
    return this.store.select('state', 'advertiser', 'campaigns')
      .map(campaigns => campaigns.find(campaign => campaign.id === id))
      .filter(campaign => !!campaign )
      .take(1);
  }
}
