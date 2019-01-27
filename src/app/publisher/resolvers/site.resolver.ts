import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { Site } from 'models/site.model';
import {Store} from "@ngrx/store";
import {AppState} from "models/app-state.model";
import {LoadSite, LoadSitesTotals} from "store/publisher/publisher.actions";


@Injectable()
export class SiteResolver implements Resolve<Site> {
  constructor(private store: Store<AppState>) {
  }


  resolve(route: ActivatedRouteSnapshot): Observable<Site> {
    this.initSiteData(route);
    return this.waitForSiteDataToLoad(route)
  }

  initSiteData(route: ActivatedRouteSnapshot): void {
    this.store.take(1).subscribe(store => {
      const currentSite = store.state.publisher.sites
        .find(site => site.id === route.params.id);

      if (!currentSite) {
        const dateTo = moment().format('YYYY-MM-DD');
        const dateFrom = moment().subtract(7,'d').format('YYYY-MM-DD');
        this.store.dispatch(new LoadSite(route.params.id));
        this.store.dispatch(new LoadSitesTotals({from: dateFrom, to: dateTo, id: route.params.id}));
      }
    });
  }

  waitForSiteDataToLoad(route: ActivatedRouteSnapshot): Observable<Site> {
    return this.store.select('state', 'publisher', 'sites')
      .map(sites => sites.find(site => site.id !== route.params.id))
      .filter(site => !!site)
      .take(1);
  }
}
