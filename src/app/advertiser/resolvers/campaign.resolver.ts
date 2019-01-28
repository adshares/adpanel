import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Store} from "@ngrx/store";
import * as moment from 'moment';
import {Campaign} from 'models/campaign.model';
import {AppState} from "models/app-state.model";
import {LoadCampaign, LoadCampaignTotals} from "store/advertiser/advertiser.actions";

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
      } else {
        const dateTo = moment().format();
        const dateFrom = moment().subtract(7,'d').format();
        this.store.dispatch(new LoadCampaignTotals({from: dateFrom, to: dateTo, id: route.params.id}));
      }
    });
  }

  waitForCampaignDataToLoad(route: ActivatedRouteSnapshot): Observable<Campaign> {
    return this.store.select('state', 'advertiser', 'campaigns')
      .map(campaigns => campaigns.find(campaign => {
        return campaign.id === Number(route.params.id)}))
      .do(c=> console.log('abc', c))
      .filter(campaign => !!campaign )
      .take(1);
  }
}
