import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { PublisherService } from 'publisher/publisher.service';
import * as publisherActions from './publisher.actions';
import { ShowSuccessSnackbar } from '../common/common.actions';
import { STATUS_SAVE_SUCCESS } from 'common/utilities/messages';
import { prepareTargetingChoices } from "common/components/targeting/targeting.helpers";
import { Observable } from "rxjs";
import "rxjs/add/operator/takeLast";
import * as moment from "moment";
import { HTTP_INTERNAL_SERVER_ERROR } from "common/utilities/codes";
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';

@Injectable()
export class PublisherEffects {
  constructor(
    private actions$: Actions,
    private service: PublisherService,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  @Effect()
  loadSites$ = this.actions$
    .ofType(publisherActions.LOAD_SITES)
    .map(toPayload)
    .switchMap((payload) => this.service.getSites()
      .switchMap((sites) => {
        const to = payload.to || moment().format();
        const from = payload.from || moment().subtract(7, 'd').format();
        return [
          new publisherActions.LoadSitesSuccess(sites),
          new publisherActions.LoadSitesTotals({from, to})
        ]
      })
      .catch(() => Observable.of(new publisherActions.LoadSitesTotalsFailure()))
    );

  @Effect()
  loadSite$ = this.actions$
    .ofType(publisherActions.LOAD_SITE)
    .map(toPayload)
    .switchMap((id) => this.service.getSite(id)
      .map(site => new publisherActions.LoadSiteSuccess(site))
      .catch(() => Observable.of(new publisherActions.LoadSiteFailure()))
    );

  @Effect()
  loadSiteTotals$ = this.actions$
    .ofType(publisherActions.LOAD_SITE_TOTALS)
    .map(toPayload)
    .switchMap((payload) => this.service.getSitesTotals(`${payload.from}`, `${payload.to}`, payload.id)
      .map((sitesTotals) => new publisherActions.LoadSiteTotalsSuccess(sitesTotals))
      .catch(() => Observable.of(new publisherActions.LoadSiteTotalsFailure()))
    );

  @Effect()
  loadSitesTotals$ = this.actions$
    .ofType(publisherActions.LOAD_SITES_TOTALS)
    .map(toPayload)
    .switchMap((payload) => this.service.getSitesTotals(`${payload.from}`, `${payload.to}`)
      .map((sitesTotals) => new publisherActions.LoadSitesTotalsSuccess(sitesTotals))
      .catch(() => Observable.of(new publisherActions.LoadSitesTotalsFailure()))
    );

  @Effect()
  addSiteToSites$ = this.actions$
    .ofType(publisherActions.ADD_SITE_TO_SITES)
    .map(toPayload)
    .switchMap((payload) => this.service.saveSite(payload)
      .switchMap((site) => {
        this.router.navigate(['/publisher', 'dashboard']);
        this.dialog.open(ConfirmResponseDialogComponent, {
          data: {
            title: 'The site has been added successfully',
            message: 'The site is pending verification.\nYou will be notified by an e-mail when the status changes.',
          }
        });

        return [
          new publisherActions.AddSiteToSitesSuccess(site),
          new publisherActions.ClearLastEditedSite()
        ]
      })
      .catch(err => {
        if (err !== HTTP_INTERNAL_SERVER_ERROR) {
          return Observable.of(new publisherActions.AddSiteToSitesFailure(
            `We weren't able to save your site due to this error: ${err.error.message} \n
            Please try again later.`
          ))
        }
      })
    );

  @Effect()
  getLanguageList$ = this.actions$
    .ofType(publisherActions.GET_LANGUAGES_LIST)
    .map(toPayload)
    .switchMap(() => this.service.getLanguagesList()
      .map((list) => new publisherActions.GetLanguagesListSuccess(list))
      .catch(() => Observable.of(new publisherActions.GetLanguagesListFailure()))
    );

  @Effect()
  getFilteringCriteria$ = this.actions$
    .ofType(publisherActions.GET_FILTERING_CRITERIA)
    .map(toPayload)
    .switchMap(() => this.service.getFilteringCriteria())
    .map((filteringOptions) => prepareTargetingChoices(filteringOptions))
    .map((criteria) => new publisherActions.GetFilteringCriteriaSuccess(criteria));

  @Effect()
  updateSite$ = this.actions$
    .ofType(
      publisherActions.UPDATE_SITE,
      publisherActions.UPDATE_SITE_FILTERING
    )
    .map(toPayload)
    .switchMap(payload => this.service.updateSiteData(payload.id, payload)
      .switchMap(() => {
        this.router.navigate(['/publisher', 'site', payload.id]);
        return [
          new publisherActions.UpdateSiteSuccess(payload),
          new publisherActions.ClearLastEditedSite(),
        ]
      })
      .catch(() => Observable.of(new publisherActions.UpdateSiteFailure()))
    );

  @Effect()
  updateSiteAdUnits$ = this.actions$
    .ofType(
      publisherActions.UPDATE_SITE_UNITS,
    )
    .map(toPayload)
    .switchMap(payload => this.service.updateSiteData(payload.id, payload)
      .switchMap(() => {
        this.router.navigate(['/publisher', 'site', payload.id]);
        return [
          new publisherActions.ClearLastEditedSite(),
          new publisherActions.UpdateSiteUnitsSuccess(),
          new publisherActions.LoadSite(payload.id),
        ]
      })
      .catch(() => Observable.of(new publisherActions.UpdateSiteUnitsFailure()))
    );

  @Effect()
  updateSiteStatus$ = this.actions$
    .ofType(publisherActions.UPDATE_SITE_STATUS)
    .map(toPayload)
    .switchMap(payload => this.service.updateSiteData(payload.id, payload)
      .switchMap(() => [
          new publisherActions.UpdateSiteStatusSuccess(payload),
          new ShowSuccessSnackbar(STATUS_SAVE_SUCCESS)
        ]
      )
      .catch(() => Observable.of(new publisherActions.UpdateSiteStatusFailure()))
    );
}
