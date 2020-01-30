import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { Site } from 'models/site.model';
import { Store } from "@ngrx/store";
import { AppState } from "models/app-state.model";
import { LoadSite, LoadSiteTotals, SetLastEditedSite } from "store/publisher/publisher.actions";
import { ChartFilterSettings } from "models/chart/chart-filter-settings.model";
import { HandleSubscription } from "common/handle-subscription";
import { LoadCampaign } from "store/advertiser/advertiser.actions";


@Injectable()
export class SiteResolver extends HandleSubscription implements Resolve<Site> {
  constructor(private store: Store<AppState>) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Site> {
    const id = Number(route.params.id);
    const isInEditMode = route.routeConfig.path.includes('edit-site');

    this.initSiteData(id);
    return this.waitForSiteDataToLoad(id, isInEditMode)
  }

  initSiteData(id: number): void {
    this.store.dispatch(new LoadSite(id));
  }

  waitForSiteDataToLoad(id: number, isInEditMode: boolean): Observable<Site> {
    return this.store.select('state', 'publisher', 'sites')
      .map(sites => sites.find(site => site.id === id))
      .filter(site => !!site)
      .do((site) => {
        if (isInEditMode) {
          this.store.dispatch(new SetLastEditedSite(site))
        } else {
          return site;
        }
      })
      .take(1);
  }
}
