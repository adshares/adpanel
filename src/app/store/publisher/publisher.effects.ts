import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import * as publisherActions from './publisher.actions';
import { PublisherService } from '../../publisher/publisher.service';
import { AppState } from '../../models/app-state.model';

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
    .withLatestFrom(this.store.select('state', 'user', 'data', 'id'))
    .switchMap(([action, userId]) => this.service.getSites(userId))
    .map((sites) => new publisherActions.LoadSitesSuccess(sites));
}
