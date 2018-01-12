import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';

import * as publisherActions from './publisher.actions';
import { PublisherService } from '../../publisher/publisher.service';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class PublisherEffects {
  constructor(
    private actions$: Actions,
    private service: PublisherService
  ) {}

  @Effect()
  loadSites$ = this.actions$
    .ofType(publisherActions.LOAD_SITES)
    .map((action: publisherActions.LoadSites) => action.payload)
    .switchMap(() => this.service.getSites())
    .map((sites) => new publisherActions.LoadSitesSuccess(sites));
}
