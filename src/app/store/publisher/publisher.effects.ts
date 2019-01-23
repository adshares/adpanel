import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {PublisherService} from 'publisher/publisher.service';
import * as publisherActions from './publisher.actions';
import {prepareTargetingChoices} from "common/components/targeting/targeting.helpers";
import {Observable} from "rxjs";
import "rxjs/add/operator/takeLast";

@Injectable()
export class PublisherEffects {
  constructor(
    private actions$: Actions,
    private service: PublisherService
  ) {
  }

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
    .switchMap((payload) => this.service.getSitesTotals(`${payload.from}`, `${payload.to}`, payload.id && payload.id)
      .map((sitesTotals) => {
        console.log('effe', sitesTotals)
        return new publisherActions.LoadSitesTotalsSuccess(sitesTotals)})
      .catch(() => Observable.of(new publisherActions.LoadSitesTotalsFailure()))
    );

  @Effect()
  addSiteToSites = this.actions$
    .ofType(publisherActions.ADD_SITE_TO_SITES)
    .map(toPayload)
    .switchMap((payload) => this.service.saveSite(payload))
    .map((site) => new publisherActions.AddSiteToSitesSuccess(site));

  @Effect()
  getLanguageList = this.actions$
    .ofType(publisherActions.GET_LANGUAGES_LIST)
    .map(toPayload)
    .switchMap(() => this.service.getLanguagesList())
    .map((list) => new publisherActions.GetLanguagesListSuccess(list));

  @Effect()
  getFilteringCriteria = this.actions$
    .ofType(publisherActions.GET_FILTERING_CRITERIA)
    .map(toPayload)
    .switchMap(() => this.service.getFilteringCriteria())
    .map((filteringOptions) => prepareTargetingChoices(filteringOptions))
    .map((criteria) => new publisherActions.GetFilteringCriteriaSuccess(criteria));
}
