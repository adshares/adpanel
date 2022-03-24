import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { of as observableOf } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'

import { PublisherService } from 'publisher/publisher.service'
import * as publisherActions from './publisher.actions'
import {
  AddSiteToSites,
  LoadSite,
  LoadSites,
  LoadSitesTotals,
  LoadSiteTotals,
  UpdateSite,
  UpdateSiteFiltering,
  UpdateSiteStatus,
  UpdateSiteUnits
} from './publisher.actions'
import { ShowSuccessSnackbar } from '../common/common.actions'
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
      ofType<LoadSites>(publisherActions.LOAD_SITES),
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
              new publisherActions.LoadSitesSuccess(sites),
              new publisherActions.LoadSitesTotals({
                from,
                to
              })
            ]
          }),
          catchError(() => observableOf(new publisherActions.LoadSitesTotalsFailure()))
        )
      )
    )

  @Effect()
  loadSite$ = this.actions$
    .pipe(
      ofType<LoadSite>(publisherActions.LOAD_SITE),
      switchMap(action => this.service.getSite(action.payload)
        .pipe(
          map(site => new publisherActions.LoadSiteSuccess(site)),
          catchError(() => observableOf(new publisherActions.LoadSiteFailure()))
        )
      )
    )

  @Effect()
  loadSiteTotals$ = this.actions$
    .pipe(
      ofType<LoadSiteTotals>(publisherActions.LOAD_SITE_TOTALS),
      map(action => action.payload),
      switchMap(payload => this.service.getSitesTotals(`${payload.from}`, `${payload.to}`, payload.id)
        .pipe(
          map(sitesTotals => new publisherActions.LoadSiteTotalsSuccess(sitesTotals)),
          catchError(() => observableOf(new publisherActions.LoadSiteTotalsFailure()))
        )
      )
    )

  @Effect()
  loadSitesTotals$ = this.actions$
    .pipe(
      ofType<LoadSitesTotals>(publisherActions.LOAD_SITES_TOTALS),
      map(action => action.payload),
      switchMap(payload => this.service.getSitesTotals(`${payload.from}`, `${payload.to}`)
        .pipe(
          map(sitesTotals => new publisherActions.LoadSitesTotalsSuccess(sitesTotals)),
          catchError(() => observableOf(new publisherActions.LoadSitesTotalsFailure()))
        )
      )
    )

  @Effect()
  addSiteToSites$ = this.actions$
    .pipe(
      ofType<AddSiteToSites>(publisherActions.ADD_SITE_TO_SITES),
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
              new publisherActions.AddSiteToSitesSuccess(site),
              new publisherActions.ClearLastEditedSite()
            ]
          }),
          catchError(error => {
            if (error !== HTTP_INTERNAL_SERVER_ERROR) {
              return observableOf(new publisherActions.AddSiteToSitesFailure(
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
      ofType(publisherActions.GET_LANGUAGES_LIST),
      switchMap(() => this.service.getLanguagesList()
        .pipe(
          map(siteLanguages => new publisherActions.GetLanguagesListSuccess(siteLanguages)),
          catchError(() => observableOf(new publisherActions.GetLanguagesListFailure()))
        )
      )
    )

  @Effect()
  getFilteringCriteria$ = this.actions$
    .pipe(
      ofType(publisherActions.GET_FILTERING_CRITERIA),
      switchMap(() => this.service.getFilteringCriteria()),
      map(filteringOptions => new publisherActions.GetFilteringCriteriaSuccess(prepareFilteringChoices(filteringOptions)))
    )

  @Effect()
  updateSite$ = this.actions$
    .pipe(
      ofType<UpdateSite | UpdateSiteFiltering>(
        publisherActions.UPDATE_SITE,
        publisherActions.UPDATE_SITE_FILTERING
      ),
      map(action => action.payload),
      switchMap(payload => this.service.updateSiteData(payload.id, payload)
        .pipe(
          switchMap(() => {
            this.router.navigate(['/publisher', 'site', payload.id])
            return [
              new publisherActions.UpdateSiteSuccess(payload),
              new publisherActions.ClearLastEditedSite(),
            ]
          }),
          catchError(() => observableOf(new publisherActions.UpdateSiteFailure()))
        )
      )
    )

  @Effect()
  updateSiteAdUnits$ = this.actions$
    .pipe(
      ofType<UpdateSiteUnits>(publisherActions.UPDATE_SITE_UNITS),
      map(action => action.payload),
      switchMap(payload => this.service.updateSiteData(payload.id, payload)
        .pipe(
          switchMap(() => {
            this.router.navigate(['/publisher', 'site', payload.id])
            return [
              new publisherActions.ClearLastEditedSite(),
              new publisherActions.UpdateSiteUnitsSuccess(),
              new publisherActions.LoadSite(payload.id),
            ]
          }),
          catchError(() => observableOf(new publisherActions.UpdateSiteUnitsFailure()))
        )
      )
    )

  @Effect()
  updateSiteStatus$ = this.actions$
    .pipe(
      ofType<UpdateSiteStatus>(publisherActions.UPDATE_SITE_STATUS),
      map(action => action.payload),
      switchMap(payload => this.service.updateSiteData(payload.id, payload)
        .pipe(
          switchMap(() => [
              new publisherActions.UpdateSiteStatusSuccess(payload),
              new ShowSuccessSnackbar(STATUS_SAVE_SUCCESS)
            ]
          ),
          catchError(() => observableOf(new publisherActions.UpdateSiteStatusFailure()))
        )
      )
    )
}
