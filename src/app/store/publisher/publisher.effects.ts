import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';

import { PublisherService } from 'publisher/publisher.service';
import * as publisherActions from './publisher.actions';

@Injectable()
export class PublisherEffects {
  constructor(
    private actions$: Actions,
    private service: PublisherService
  ) { }

  @Effect()
  loadSites$ = this.actions$
    .ofType(publisherActions.LOAD_SITES)
    .map(toPayload)
    .switchMap((payload) => this.service.getSites(payload))
    .map((sites) => new publisherActions.LoadSitesSuccess(sites));

  @Effect()
  loadSitesTotals$ = this.actions$
    .ofType(publisherActions.LOAD_SITES_TOTALS)
    .map(toPayload)
    .switchMap((payload) => this.service.getSitesTotals(payload))
    .map((sitesTotals) => new publisherActions.LoadSitesTotalsSuccess(sitesTotals));

  @Effect()
  addSiteToSites = this.actions$
    .ofType(publisherActions.ADD_SITE_TO_SITES)
    .map(toPayload)
    .switchMap((payload) => this.service.saveSite(payload))
    .map((site) => new publisherActions.AddSiteToSitesSuccess(site));
}
