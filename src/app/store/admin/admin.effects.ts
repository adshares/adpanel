import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  GET_LICENSE,
  GetLicenseFailure,
  GetLicenseSuccess,
  LOAD_ADMIN_SETTINGS,
  LOAD_ADVERTISERS,
  LOAD_PUBLISHERS,
  LOAD_USERS,
  LoadAdminSettingsFailure,
  LoadAdminSettingsSuccess,
  LoadAdvertisers,
  LoadAdvertisersFailure,
  LoadAdvertisersSuccess,
  LoadPublishers,
  LoadPublishersFailure,
  LoadPublishersSuccess,
  LoadUsers,
  LoadUsersFailure,
  LoadUsersSuccess,
} from './admin.actions';
import { AdminService } from 'admin/admin.service';
import { of as observableOf } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { HTTP_NOT_FOUND } from 'common/utilities/codes';

@Injectable()
export class AdminEffects {
  constructor(private actions$: Actions, private service: AdminService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadUsers>(LOAD_USERS),
      debounceTime(100),
      map(action => action.payload),
      switchMap(payload => {
        return this.service
          .getUsers(payload.nextPage, payload.searchPhrase, payload.filters, payload.orderBy, payload.direction)
          .pipe(
            map(users => new LoadUsersSuccess(users)),
            catchError(error => observableOf(new LoadUsersFailure(error)))
          );
      })
    )
  );

  loadAdvertisers$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadAdvertisers>(LOAD_ADVERTISERS),
      debounceTime(100),
      map(action => action.payload),
      switchMap(payload =>
        this.service
          .getAdvertisers(payload.groupBy, payload.interval, payload.searchPhrase, payload.minDailyViews)
          .pipe(
            map(advertisers => new LoadAdvertisersSuccess(advertisers)),
            catchError(error => observableOf(new LoadAdvertisersFailure(error)))
          )
      )
    )
  );

  loadPublishers$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadPublishers>(LOAD_PUBLISHERS),
      debounceTime(100),
      map(action => action.payload),
      switchMap(payload =>
        this.service.getPublishers(payload.groupBy, payload.interval, payload.searchPhrase, payload.minDailyViews).pipe(
          map(publishers => new LoadPublishersSuccess(publishers)),
          catchError(error => observableOf(new LoadPublishersFailure(error)))
        )
      )
    )
  );

  getLicense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_LICENSE),
      switchMap(() =>
        this.service.getLicense().pipe(
          map(license => new GetLicenseSuccess(license)),
          catchError(error => {
            if (error.status === HTTP_NOT_FOUND) {
              return observableOf(new GetLicenseFailure());
            }
            return observableOf(new GetLicenseFailure("We weren't able to get your license. Please, try again later"));
          })
        )
      )
    )
  );

  loadAdminSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_ADMIN_SETTINGS),
      switchMap(() =>
        this.service.getAdminSettings().pipe(
          map(settings => new LoadAdminSettingsSuccess(settings)),
          catchError(error => observableOf(new LoadAdminSettingsFailure(error)))
        )
      )
    )
  );
}
