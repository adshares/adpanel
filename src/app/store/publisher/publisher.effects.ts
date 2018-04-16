import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/switchMap';

import { PublisherService } from 'publisher/publisher.service';
import { AppState } from 'models/app-state.model';
import * as publisherActions from './publisher.actions';

@Injectable()
export class PublisherEffects {
  constructor(
    private actions$: Actions,
    private service: PublisherService,
    private store: Store<AppState>
  ) { }

  @Effect()
  loadSites$ = this.actions$
    .ofType(publisherActions.LOAD_SITES)
    .switchMap(() => this.service.getSites())
    .map((sites) => new publisherActions.LoadSitesSuccess(sites));

  @Effect()
  addSiteToSites = this.actions$
    .ofType(publisherActions.ADD_SITE_TO_SITES)
    .map(toPayload)
    .switchMap((payload) => this.service.saveSite(payload))
    .map((site) => new publisherActions.AddSiteToSitesSuccess(site));
}
