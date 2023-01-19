import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { Site } from 'models/site.model';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { LoadSite, SetLastEditedSite } from 'store/publisher/publisher.actions';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';

@Injectable()
export class SiteResolver extends HandleSubscriptionComponent implements Resolve<Site> {
  constructor(private store: Store<AppState>) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Site> {
    const id = Number(route.params.id);
    const isInEditMode = route.routeConfig.path.includes('edit-site');

    this.initSiteData(id);
    return this.waitForSiteDataToLoad(id, isInEditMode);
  }

  initSiteData(id: number): void {
    this.store.dispatch(new LoadSite(id));
  }

  waitForSiteDataToLoad(id: number, isInEditMode: boolean): Observable<Site> {
    return this.store.select('state', 'publisher', 'sites').pipe(
      map(sites => sites.find(site => site.id === id)),
      filter(site => !!site),
      tap(site => {
        if (isInEditMode) {
          this.store.dispatch(new SetLastEditedSite(site));
        } else {
          return site;
        }
      }),
      take(1)
    );
  }
}
