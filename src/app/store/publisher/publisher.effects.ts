import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { PublisherService } from 'publisher/publisher.service';
import {
  ADD_SITE_TO_SITES,
  AddSiteToSites,
  AddSiteToSitesSuccess,
  ClearLastEditedSite,
  GET_LANGUAGES_LIST,
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
  UpdateSiteStatusSuccess,
  UpdateSiteSuccess,
  UpdateSiteUnits,
  UpdateSiteUnitsSuccess,
} from './publisher.actions';
import { ShowDialogOnError, ShowSuccessSnackbar } from '../common/common.actions';
import { STATUS_SAVE_SUCCESS } from 'common/utilities/messages';
import * as moment from 'moment';
import { HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';

@Injectable()
export class PublisherEffects {
  constructor(
    private actions$: Actions,
    private service: PublisherService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  loadSites$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadSites>(LOAD_SITES),
      map(action => action.payload),
      switchMap(payload =>
        this.service.getSites().pipe(
          switchMap(sites => {
            let to = payload.to || moment().format();
            let from = payload.from || moment().subtract(7, 'd').format();
            if (typeof to === 'object') {
              to = to.format();
            }
            if (typeof from === 'object') {
              from = from.format();
            }
            return [
              new LoadSitesSuccess(sites),
              new LoadSitesTotals({
                from,
                to,
              }),
            ];
          }),
          catchError(() => observableOf(new LoadSitesTotalsFailure()))
        )
      )
    )
  );

  loadSite$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadSite>(LOAD_SITE),
      switchMap(action =>
        this.service.getSite(action.payload).pipe(
          map(site => new LoadSiteSuccess(site)),
          catchError(() => observableOf(new LoadSiteFailure()))
        )
      )
    )
  );

  loadSiteTotals$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadSiteTotals>(LOAD_SITE_TOTALS),
      map(action => action.payload),
      switchMap(payload =>
        this.service.getSitesTotals(`${payload.from}`, `${payload.to}`, payload.id).pipe(
          map(sitesTotals => new LoadSiteTotalsSuccess(sitesTotals)),
          catchError(() => observableOf(new LoadSiteTotalsFailure()))
        )
      )
    )
  );

  loadSitesTotals$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadSitesTotals>(LOAD_SITES_TOTALS),
      map(action => action.payload),
      switchMap(payload =>
        this.service.getSitesTotals(`${payload.from}`, `${payload.to}`).pipe(
          map(sitesTotals => new LoadSitesTotalsSuccess(sitesTotals)),
          catchError(() => observableOf(new LoadSitesTotalsFailure()))
        )
      )
    )
  );

  addSiteToSites$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AddSiteToSites>(ADD_SITE_TO_SITES),
      switchMap(action =>
        this.service.saveSite(action.payload).pipe(
          switchMap(response => {
            this.router.navigate(['/publisher', 'dashboard']);
            this.dialog.open(ConfirmResponseDialogComponent, {
              data: {
                title: 'The site has been added successfully',
                message:
                  'The site is pending verification.\nYou will be notified by an e-mail when the status changes.',
              },
            });
            const site = response.data;
            return [new AddSiteToSitesSuccess(site), new ClearLastEditedSite()];
          }),
          catchError(error => {
            if (error !== HTTP_INTERNAL_SERVER_ERROR) {
              return observableOf(
                new ShowDialogOnError(
                  `We weren't able to save your site due to this error: ${error.error.message} \n
            Please try again later.`
                )
              );
            }
          })
        )
      )
    )
  );

  getLanguageList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_LANGUAGES_LIST),
      switchMap(() =>
        this.service.getLanguagesList().pipe(
          map(siteLanguages => new GetLanguagesListSuccess(siteLanguages)),
          catchError(() => observableOf(new GetLanguagesListFailure()))
        )
      )
    )
  );

  updateSite$ = createEffect(() =>
    this.actions$.pipe(
      ofType<UpdateSite | UpdateSiteFiltering>(UPDATE_SITE, UPDATE_SITE_FILTERING),
      map(action => action.payload),
      switchMap(payload =>
        this.service.updateSiteData(payload.id, payload).pipe(
          switchMap(response => {
            const site = response.data;
            this.router.navigate(['/publisher', 'site', site.id]);
            return [new UpdateSiteSuccess(site), new ClearLastEditedSite()];
          }),
          catchError(() => observableOf(new UpdateSiteFailure()))
        )
      )
    )
  );

  updateSiteAdUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType<UpdateSiteUnits>(UPDATE_SITE_UNITS),
      map(action => action.payload),
      switchMap(payload =>
        this.service.updateSiteData(payload.id, payload).pipe(
          switchMap(() => {
            this.router.navigate(['/publisher', 'site', payload.id]);
            return [new ClearLastEditedSite(), new UpdateSiteUnitsSuccess(), new LoadSite(payload.id)];
          }),
          catchError(() => observableOf(new ShowDialogOnError('Placements cannot be updated')))
        )
      )
    )
  );

  updateSiteStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType<UpdateSiteStatus>(UPDATE_SITE_STATUS),
      map(action => action.payload),
      switchMap(payload =>
        this.service.updateSiteData(payload.id, payload).pipe(
          switchMap(value => [new UpdateSiteStatusSuccess(value.data), new ShowSuccessSnackbar(STATUS_SAVE_SUCCESS)]),
          catchError(() => observableOf(new ShowDialogOnError('Site status cannot be changed')))
        )
      )
    )
  );
}
