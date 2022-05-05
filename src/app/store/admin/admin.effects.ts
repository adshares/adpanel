import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import {
  GET_INDEX,
  GET_LICENSE,
  GET_PRIVACY_SETTINGS,
  GET_REJECTED_DOMAINS,
  GET_TERMS_SETTINGS,
  GetIndex,
  GetIndexFailure,
  GetIndexSuccess,
  GetLicenseFailure,
  GetLicenseSuccess,
  GetPrivacySettingsSuccess,
  GetRejectedDomainsSuccess,
  GetTermsSettingsSuccess,
  LOAD_ADMIN_SETTINGS,
  LOAD_ADMIN_SITE_OPTIONS,
  LOAD_ADMIN_WALLET,
  LOAD_ADVERTISERS,
  LOAD_PUBLISHERS,
  LOAD_USERS,
  LoadAdminSettingsFailure,
  LoadAdminSettingsSuccess,
  LoadAdminSiteOptionsFailure,
  LoadAdminSiteOptionsSuccess,
  LoadAdminWalletFailure,
  LoadAdminWalletSuccess,
  LoadAdvertisers,
  LoadAdvertisersFailure,
  LoadAdvertisersSuccess,
  LoadPublishers,
  LoadPublishersFailure,
  LoadPublishersSuccess,
  LoadUsers,
  LoadUsersFailure,
  LoadUsersSuccess,
  REQUEST_GET_INDEX,
  SET_ADMIN_SETTINGS,
  SET_ADMIN_SITE_OPTIONS,
  SET_PRIVACY_SETTINGS,
  SET_REJECTED_DOMAINS,
  SET_TERMS_SETTINGS,
  SetAdminSettings,
  SetAdminSettingsSuccess,
  SetAdminSiteOptions,
  SetAdminSiteOptionsSuccess,
  SetPrivacySettings,
  SetPrivacySettingsFailure,
  SetPrivacySettingsSuccess,
  SetRejectedDomains,
  SetRejectedDomainsSuccess,
  SetTermsSettings,
  SetTermsSettingsSuccess,
} from './admin.actions'
import { ShowDialogOnError, ShowSuccessSnackbar } from '../common/common.actions'
import { SAVE_SUCCESS } from 'common/utilities/messages'
import { AdminService } from 'admin/admin.service'
import { merge, of as observableOf } from 'rxjs'
import { catchError, debounceTime, delay, filter, map, switchMap, tap } from 'rxjs/operators'
import { ClickToADSPipe } from 'common/pipes/adshares-token.pipe'
import { HTTP_NOT_FOUND } from 'common/utilities/codes'
import { USER_LOG_OUT_SUCCESS } from 'store/auth/auth.actions'
import { AdminSettingsResponse, AdminSiteOptionsResponse } from 'models/settings.model'

@Injectable()
export class AdminEffects {
  private readonly INTERVAL_GET_INDEX = 3600000;
  private readonly INTERVAL_GET_INDEX_AFTER_ERROR = 10000;
  private allowGetIndex = false;

  constructor(
    private actions$: Actions,
    private service: AdminService,
    private clickToADSPipe: ClickToADSPipe
  ) {
  }

  @Effect()
  loadUsers$ = this.actions$
    .pipe(
      ofType<LoadUsers>(LOAD_USERS),
      debounceTime(100),
      map(action => action.payload),
      switchMap(payload => {
          return this.service.getUsers(payload.nextPage, payload.searchPhrase, payload.filters, payload.orderBy, payload.direction)
            .pipe(
              map(users => new LoadUsersSuccess(users)),
              catchError(error => observableOf(new LoadUsersFailure(error)))
            )
        }
      )
    )

  @Effect()
  loadAdvertisers$ = this.actions$
    .pipe(
      ofType<LoadAdvertisers>(LOAD_ADVERTISERS),
      debounceTime(100),
      map(action => action.payload),
      switchMap(payload => this.service.getAdvertisers(payload.groupBy, payload.interval, payload.searchPhrase, payload.minDailyViews)
        .pipe(
          map(advertisers => new LoadAdvertisersSuccess(advertisers)),
          catchError(error => observableOf(new LoadAdvertisersFailure(error)))
        )
      )
    )

  @Effect()
  loadPublishers$ = this.actions$
    .pipe(
      ofType<LoadPublishers>(LOAD_PUBLISHERS),
      debounceTime(100),
      map(action => action.payload),
      switchMap(payload => this.service.getPublishers(payload.groupBy, payload.interval, payload.searchPhrase, payload.minDailyViews)
        .pipe(
          map(publishers => new LoadPublishersSuccess(publishers)),
          catchError(error => observableOf(new LoadPublishersFailure(error)))
        )
      )
    )

  @Effect()
  requestGetIndex$ = this.actions$
    .pipe(
      ofType(REQUEST_GET_INDEX),
      map(() => {
        this.allowGetIndex = true
        return new GetIndex()
      })
    )

  @Effect({ dispatch: false })
  logOut$ = this.actions$
    .pipe(
      ofType(USER_LOG_OUT_SUCCESS),
      tap(() => {
        this.allowGetIndex = false
      })
    )

  @Effect()
  getIndex$ = this.actions$
    .pipe(
      ofType(GET_INDEX),
      filter(() => this.allowGetIndex),
      switchMap(() => this.service.getIndexUpdateTime()
        .pipe(
          switchMap(response => {
            if (!response || !response.indexUpdateTime) {
              throw new Error('Invalid format')
            }

            return merge(
              observableOf(new GetIndexSuccess(response)),
              observableOf(new GetIndex()).pipe(delay(this.INTERVAL_GET_INDEX)),
            )
          }),
          catchError((error) => {
            return merge(
              observableOf(new GetIndexFailure(error)),
              observableOf(new GetIndex()).pipe(delay(this.INTERVAL_GET_INDEX_AFTER_ERROR)),
            )
          })
        )
      )
    )

  @Effect()
  getLicense$ = this.actions$
    .pipe(
      ofType(GET_LICENSE),
      switchMap(() => this.service.getLicense()
        .pipe(
          map(license => new GetLicenseSuccess(license)),
          catchError(error => {
            if (error.status === HTTP_NOT_FOUND) {
              return observableOf(new GetLicenseFailure())
            }
            return observableOf(new GetLicenseFailure(
              'We weren\'t able to get your license. Please, try again later'
            ))
          })
        )
      )
    )

  @Effect()
  loadAdminSettings$ = this.actions$
    .pipe(
      ofType(LOAD_ADMIN_SETTINGS),
      switchMap(() => this.service.getAdminSettings()
        .pipe(
          map((response: AdminSettingsResponse) => {
            return <AdminSettingsResponse>{
              settings: {
                ...response.settings,
                advertiserCommission: Number((response.settings.advertiserCommission * 100).toFixed(2)),
                publisherCommission: Number((response.settings.publisherCommission * 100).toFixed(2)),
                referralRefundCommission: Number((response.settings.referralRefundCommission * 100).toFixed(2)),
                hotwalletMaxValue: this.clickToADSPipe.transform(response.settings.hotwalletMaxValue),
                hotwalletMinValue: this.clickToADSPipe.transform(response.settings.hotwalletMinValue),
              }
            }
          }),
          map(settings => new LoadAdminSettingsSuccess(settings)),
          catchError(error => observableOf(new LoadAdminSettingsFailure(error)))
        )
      )
    )

  @Effect()
  loadAdminSiteOptions$ = this.actions$
    .pipe(
      ofType(LOAD_ADMIN_SITE_OPTIONS),
      switchMap(() => this.service.getAdminSiteOptions()
        .pipe(
          map((response: AdminSiteOptionsResponse) => {
            return <AdminSiteOptionsResponse>{
              ...response,
            }
          }),
          map(options => new LoadAdminSiteOptionsSuccess(options)),
          catchError(error => {
            return observableOf(new LoadAdminSiteOptionsFailure(error))
          })
        )
      )
    )

  @Effect()
  loadAdminWallet$ = this.actions$
    .pipe(
      ofType(LOAD_ADMIN_WALLET),
      switchMap(() => this.service.getAdminWallet()
        .pipe(
          map(wallet => new LoadAdminWalletSuccess(wallet)),
          catchError(error => observableOf(new LoadAdminWalletFailure(error)))
        )
      )
    )

  @Effect()
  saveAdminSettings$ = this.actions$
    .pipe(
      ofType<SetAdminSettings>(SET_ADMIN_SETTINGS),
      switchMap(action => this.service.setAdminSettings(action.payload)
        .pipe(
          switchMap(() => [
            new SetAdminSettingsSuccess(action.payload),
            new ShowSuccessSnackbar(SAVE_SUCCESS)
          ]),
          catchError(() => observableOf(new ShowDialogOnError(
            'We weren\'t able to save your settings this time. Please, try again later'
          )))
        )
      )
    )

  @Effect()
  saveAdminSiteOptions$ = this.actions$
    .pipe(
      ofType<SetAdminSiteOptions>(SET_ADMIN_SITE_OPTIONS),
      switchMap(action => this.service.setAdminSiteOptions(action.payload)
        .pipe(
          switchMap(() => [
            new SetAdminSiteOptionsSuccess(action.payload),
            new ShowSuccessSnackbar(SAVE_SUCCESS)
          ]),
          catchError(() => observableOf(new ShowDialogOnError(
            'We weren\'t able to save your site options this time. Please, try again later'
          )))
        )
      )
    )

  @Effect()
  getPrivacySettings$ = this.actions$
    .pipe(
      ofType(GET_PRIVACY_SETTINGS),
      switchMap(() => this.service.getPrivacySettings()
        .pipe(
          map(privacyData => new GetPrivacySettingsSuccess(privacyData)),
          catchError(error => {
            if (error.status === HTTP_NOT_FOUND) {
              return observableOf()
            }
            return observableOf(new ShowDialogOnError(
              'We weren\'t able to fetch your settings this time. Please, try again later'
            ))
          })
        )
      )
    )

  @Effect()
  getTermsSettings$ = this.actions$
    .pipe(
      ofType(GET_TERMS_SETTINGS),
      switchMap(() => this.service.getTermsAndConditions()
        .pipe(
          map((termsData) => new GetTermsSettingsSuccess(termsData)),
          catchError(error => {
            if (error.status === HTTP_NOT_FOUND) {
              return observableOf();
            }
            return observableOf(new ShowDialogOnError(
              'We weren\'t able to fetch your settings this time. Please, try again later'
            ));
          })
        )
      )
    )

  @Effect()
  setTermsSettings$ = this.actions$
    .pipe(
      ofType<SetTermsSettings>(SET_TERMS_SETTINGS),
      switchMap(action => this.service.setTermsAndConditions(action.payload)
        .pipe(
          switchMap((termsData) => [
            new SetTermsSettingsSuccess(termsData),
            new ShowSuccessSnackbar(SAVE_SUCCESS)
          ]),
          catchError(() => {
            return observableOf(new SetPrivacySettingsFailure(
              'We weren\'t able to save your settings this time. Please, try again later'
            ))
          })
        )
      )
    )

  @Effect()
  setPrivacySettings$ = this.actions$
    .pipe(
      ofType<SetPrivacySettings>(SET_PRIVACY_SETTINGS),
      switchMap(action => this.service.setPrivacySettings(action.payload)
        .pipe(
          switchMap(termsData => [
            new SetPrivacySettingsSuccess(termsData),
            new ShowSuccessSnackbar(SAVE_SUCCESS)
          ]),
          catchError(() => {
            return observableOf(new SetPrivacySettingsFailure(
              'We weren\'t able to save your settings this time. Please, try again later'
            ))
          })
        )
      )
    )

  @Effect()
  getRejectedDomains$ = this.actions$
    .pipe(
      ofType(GET_REJECTED_DOMAINS),
      switchMap(() => this.service.getRejectedDomains()
        .pipe(
          map(response => new GetRejectedDomainsSuccess(response)),
          catchError(() => observableOf(
            new ShowDialogOnError('Rejected domains are not available. Please, try again later.')
          ))
        )
      )
    )

  @Effect()
  setRejectedDomains$ = this.actions$
    .pipe(
      ofType<SetRejectedDomains>(SET_REJECTED_DOMAINS),
      switchMap(action => this.service.putRejectedDomains(action.payload)
        .pipe(
          switchMap(() => [
            new SetRejectedDomainsSuccess(),
            new ShowSuccessSnackbar(SAVE_SUCCESS),
          ]),
          catchError(() => observableOf(new ShowDialogOnError(
            'Rejected domains were not saved. Please, try again later.'
          )))
        )
      )
    )
}
