import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import {Site} from 'models/site.model';
import {Store} from "@ngrx/store";
import {AppState} from "models/app-state.model";
import {LoadSite, LoadSiteTotals} from "store/publisher/publisher.actions";


@Injectable()
export class SiteResolver implements Resolve<Site> {
  constructor(private store: Store<AppState>) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Site> {
    const id = Number(route.params.id);

    this.initSiteData(id);
    return this.waitForSiteDataToLoad(id)
  }

  initSiteData(id: number): void {
    this.store.take(1).subscribe(store => {
      const currentSite = store.state.publisher.sites
        .find(site => site.id === id);

      if (!currentSite) {
        this.store.dispatch(new LoadSite(id));
      } else {
        const dateTo = moment().format();
        const dateFrom = moment().subtract(7, 'd').format();
        this.store.dispatch(new LoadSiteTotals({from: dateFrom, to: dateTo, id}));
      }
    });
  }

  waitForSiteDataToLoad(id: number): Observable<Site> {
    return this.store.select('state', 'publisher', 'sites')
      .map(sites => sites.find(site => site.id === id))
      .filter(site => !!site)
      .take(1);
  }
}
