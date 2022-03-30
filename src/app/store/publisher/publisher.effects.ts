import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { of as observableOf } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'

import { PublisherService } from 'publisher/publisher.service'
import {
  ADD_SITE_TO_SITES,
  AddSiteToSites,
  AddSiteToSitesSuccess,
  ClearLastEditedSite,
  GET_FILTERING_CRITERIA,
  GET_LANGUAGES_LIST,
  GetFilteringCriteriaSuccess,
  GetLanguagesListFailure,
  GetLanguagesListSuccess,
  LOAD_SITE,
  LOAD_SITE_TOTALS,
  LOAD_SITES,
  LOAD_SITES_TOTALS,
  LoadSite,
  LoadSiteFailure,
  LoadSites,
  LoadSitesSuccess,
  LoadSitesTotals,
  LoadSitesTotalsFailure,
  LoadSitesTotalsSuccess,
  LoadSiteSuccess,
  LoadSiteTotals,
  LoadSiteTotalsFailure,
  LoadSiteTotalsSuccess,
  UPDATE_SITE,
  UPDATE_SITE_FILTERING,
  UPDATE_SITE_STATUS,
  UPDATE_SITE_UNITS,
  UpdateSite,
  UpdateSiteFailure,
  UpdateSiteFiltering,
  UpdateSiteStatus,
  UpdateSiteStatusFailure,
  UpdateSiteStatusSuccess,
  UpdateSiteSuccess,
  UpdateSiteUnits,
  UpdateSiteUnitsFailure,
  UpdateSiteUnitsSuccess,
} from './publisher.actions'
import { ShowDialogOnError, ShowSuccessSnackbar } from '../common/common.actions'
import { STATUS_SAVE_SUCCESS } from 'common/utilities/messages'
import { prepareFilteringChoices } from 'common/components/targeting/targeting.helpers'
import * as moment from 'moment'
import { HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes'
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component'

@Injectable()
export class PublisherEffects {
  constructor (
    private actions$: Actions,
    private service: PublisherService,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  @Effect()
  loadSites$ = this.actions$
    .pipe(
      ofType<LoadSites>(LOAD_SITES),
      map(action => action.payload),
      switchMap(payload => this.service.getSites()
        .pipe(
          switchMap(sites => {
            let to = payload.to || moment().format()
            let from = payload.from || moment().subtract(7, 'd').format()
            if (typeof to === 'object') {
              to = to.format()
            }
            if (typeof from === 'object') {
              from = from.format()
            }
            return [
              new LoadSitesSuccess(sites),
              new LoadSitesTotals({
                from,
                to
              })
            ]
          }),
          catchError(() => observableOf(new LoadSitesTotalsFailure()))
        )
      )
    )

  @Effect()
  loadSite$ = this.actions$
    .pipe(
      ofType<LoadSite>(LOAD_SITE),
      switchMap(action => this.service.getSite(action.payload)
        .pipe(
          map(site => new LoadSiteSuccess(site)),
          catchError(() => observableOf(new LoadSiteFailure()))
        )
      )
    )

  @Effect()
  loadSiteTotals$ = this.actions$
    .pipe(
      ofType<LoadSiteTotals>(LOAD_SITE_TOTALS),
      map(action => action.payload),
      switchMap(payload => this.service.getSitesTotals(`${payload.from}`, `${payload.to}`, payload.id)
        .pipe(
          map(sitesTotals => new LoadSiteTotalsSuccess(sitesTotals)),
          catchError(() => observableOf(new LoadSiteTotalsFailure()))
        )
      )
    )

  @Effect()
  loadSitesTotals$ = this.actions$
    .pipe(
      ofType<LoadSitesTotals>(LOAD_SITES_TOTALS),
      map(action => action.payload),
      switchMap(payload => this.service.getSitesTotals(`${payload.from}`, `${payload.to}`)
        .pipe(
          map(sitesTotals => new LoadSitesTotalsSuccess(sitesTotals)),
          catchError(() => observableOf(new LoadSitesTotalsFailure()))
        )
      )
    )

  @Effect()
  addSiteToSites$ = this.actions$
    .pipe(
      ofType<AddSiteToSites>(ADD_SITE_TO_SITES),
      switchMap(action => this.service.saveSite(action.payload)
        .pipe(
          switchMap((site) => {
            this.router.navigate(['/publisher', 'dashboard'])
            this.dialog.open(ConfirmResponseDialogComponent, {
              data: {
                title: 'The site has been added successfully',
                message: 'The site is pending verification.\nYou will be notified by an e-mail when the status changes.',
              }
            })

            return [
              new AddSiteToSitesSuccess(site),
              new ClearLastEditedSite()
            ]
          }),
          catchError(error => {
            if (error !== HTTP_INTERNAL_SERVER_ERROR) {
              return observableOf(new ShowDialogOnError(
                `We weren't able to save your site due to this error: ${error.error.message} \n
            Please try again later.`
              ))
            }
          })
        )
      )
    )

  @Effect()
  getLanguageList$ = this.actions$
    .pipe(
      ofType(GET_LANGUAGES_LIST),
      switchMap(() => this.service.getLanguagesList()
        .pipe(
          map(siteLanguages => new GetLanguagesListSuccess(siteLanguages)),
          catchError(() => observableOf(new GetLanguagesListFailure()))
        )
      )
    )

  @Effect()
  getFilteringCriteria$ = this.actions$
    .pipe(
      ofType(GET_FILTERING_CRITERIA),
      switchMap(() => this.service.getFilteringCriteria()),
      map(filteringOptions => new GetFilteringCriteriaSuccess(prepareFilteringChoices(filteringOptions)))
    )

  @Effect()
  updateSite$ = this.actions$
    .pipe(
      ofType<UpdateSite | UpdateSiteFiltering>(
        UPDATE_SITE,
        UPDATE_SITE_FILTERING
      ),
      map(action => action.payload),
      switchMap(payload => this.service.updateSiteData(payload.id, payload)
        .pipe(
          switchMap(() => {
            this.router.navigate(['/publisher', 'site', payload.id])
            return [
              new UpdateSiteSuccess(payload),
              new ClearLastEditedSite(),
            ]
          }),
          catchError(() => observableOf(new UpdateSiteFailure()))
        )
      )
    )

  @Effect()
  updateSiteAdUnits$ = this.actions$
    .pipe(
      ofType<UpdateSiteUnits>(UPDATE_SITE_UNITS),
      map(action => action.payload),
      switchMap(payload => this.service.updateSiteData(payload.id, payload)
        .pipe(
          switchMap(() => {
            this.router.navigate(['/publisher', 'site', payload.id])
            return [
              new ClearLastEditedSite(),
              new UpdateSiteUnitsSuccess(),
              new LoadSite(payload.id),
            ]
          }),
          catchError(() => observableOf(new UpdateSiteUnitsFailure()))
        )
      )
    )

  @Effect()
  updateSiteStatus$ = this.actions$
    .pipe(
      ofType<UpdateSiteStatus>(UPDATE_SITE_STATUS),
      map(action => action.payload),
      switchMap(payload => this.service.updateSiteData(payload.id, payload)
        .pipe(
          switchMap(() => [
              new UpdateSiteStatusSuccess(payload),
              new ShowSuccessSnackbar(STATUS_SAVE_SUCCESS)
            ]
          ),
          catchError(() => observableOf(new UpdateSiteStatusFailure()))
        )
      )
    )
}
