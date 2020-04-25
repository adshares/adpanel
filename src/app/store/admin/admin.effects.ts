import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import { delay } from 'rxjs/operators';
import {
  GET_INDEX,
  GET_INDEX_FAILURE,
  GET_INDEX_SUCCESS,
  GET_LICENSE,
  GET_PRIVACY_SETTINGS,
  GET_TERMS_SETTINGS,
  GetIndex,
  GetIndexFailure,
  GetIndexSuccess,
  GetLicenseFailure,
  GetLicenseSuccess,
  GetPrivacySettingsFailure,
  GetPrivacySettingsSuccess,
  GetTermsSettingsFailure,
  GetTermsSettingsSuccess,
  LOAD_ADMIN_SETTINGS,
  LOAD_ADMIN_WALLET,
  LOAD_PUBLISHERS,
  LOAD_USERS,
  LoadAdminSettingsFailure,
  LoadAdminSettingsSuccess,
  LoadAdminWalletFailure,
  LoadAdminWalletSuccess,
  LoadPublishersFailure,
  LoadPublishersSuccess,
  LoadUsersFailure,
  LoadUsersSuccess,
  REQUEST_GET_INDEX,
  SET_ADMIN_SETTINGS,
  SET_PRIVACY_SETTINGS,
  SET_TERMS_SETTINGS,
  SetAdminSettingsFailure,
  SetAdminSettingsSuccess,
  SetPrivacySettingsFailure,
  SetPrivacySettingsSuccess,
  SetTermsSettingsSuccess,
} from './admin.actions';
import { ShowSuccessSnackbar } from '../common/common.actions';
import { SAVE_SUCCESS } from 'common/utilities/messages';
import { AdminService } from 'admin/admin.service';
import { Observable } from 'rxjs';
import { ClickToADSPipe } from 'common/pipes/adshares-token.pipe';
import { HTTP_NOT_FOUND } from 'common/utilities/codes';
import 'rxjs/add/operator/debounceTime';
import { USER_LOG_OUT_SUCCESS } from 'store/auth/auth.actions';

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
    .ofType(LOAD_USERS)
    .debounceTime(100)
    .map(toPayload)
    .switchMap((payload) => this.service.getUsers(payload.nextPage, payload.searchPhrase)
      .map((users) => new LoadUsersSuccess(users))
      .catch((err) => Observable.of(new LoadUsersFailure(err)))
    );

  @Effect()
  loadPublishers$ = this.actions$
    .ofType(LOAD_PUBLISHERS)
    .debounceTime(100)
    .map(toPayload)
    .switchMap((payload) => this.service.getPublishers(payload.groupBy, payload.interval, payload.searchPhrase, payload.minDailyViews)
      .map((publishers) => new LoadPublishersSuccess(publishers))
      .catch((err) => Observable.of(new LoadPublishersFailure(err)))
    );

  @Effect()
  requestGetIndex$ = this.actions$
    .ofType(REQUEST_GET_INDEX)
    .map(() => {
      this.allowGetIndex = true;
      return new GetIndex();
    });

  @Effect({dispatch: false})
  logOut$ = this.actions$
    .ofType(USER_LOG_OUT_SUCCESS)
    .do(() => {
      this.allowGetIndex = false;
    });

  @Effect()
  getIndex$ = this.actions$
    .ofType(GET_INDEX)
    .filter(() => this.allowGetIndex)
    .switchMap(() => {
        return this.service.getIndexUpdateTime()
          .switchMap(response => {
            if (!response || !response.indexUpdateTime) {
              throw new Error('Invalid format');
            }

            return Observable.merge(
              Observable.of(new GetIndexSuccess(response)),
              Observable.of(new GetIndex()).pipe(delay(this.INTERVAL_GET_INDEX)),
            )
          })
          .catch((error) => {
            return Observable.merge(
              Observable.of(new GetIndexFailure(error)),
              Observable.of(new GetIndex()).pipe(delay(this.INTERVAL_GET_INDEX_AFTER_ERROR)),
            );
          })
      }
    );

  @Effect()
  getLicense$ = this.actions$
    .ofType(GET_LICENSE)
    .switchMap(() => this.service.getLicense()
      .map((license) => {
        return new GetLicenseSuccess(license)
      })
      .catch((err) => {
        if (err.status === HTTP_NOT_FOUND) {
          return Observable.of(new GetLicenseFailure());
        }
        return Observable.of(new GetLicenseFailure(
          'We weren\'t able to get your license. Please, try again later'
        ))
      })
    );

  @Effect()
  loadAdminSettings$ = this.actions$
    .ofType(LOAD_ADMIN_SETTINGS)
    .switchMap(() => this.service.getAdminSettings()
      .map((response) => {
        return {
          settings: {
            ...response.settings,
            advertiserCommission: response.settings.advertiserCommission * 100,
            publisherCommission: response.settings.publisherCommission * 100,
            hotwalletMaxValue: this.clickToADSPipe.transform(response.settings.hotwalletMaxValue),
            hotwalletMinValue: this.clickToADSPipe.transform(response.settings.hotwalletMinValue),
          }
        }
      })
      .map((settings) => new LoadAdminSettingsSuccess(settings))
      .catch((err) => Observable.of(new LoadAdminSettingsFailure(err)))
    );

  @Effect()
  loadAdminWallet$ = this.actions$
    .ofType(LOAD_ADMIN_WALLET)
    .switchMap(() => this.service.getAdminWallet()
      .map((wallet) => new LoadAdminWalletSuccess(wallet))
      .catch((err) => Observable.of(new LoadAdminWalletFailure(err)))
    );

  @Effect()
  saveAdminSettings$ = this.actions$
    .ofType(SET_ADMIN_SETTINGS)
    .map(toPayload)
    .switchMap((payload) => this.service.setAdminSettings(payload)
      .switchMap(() => [
        new SetAdminSettingsSuccess(payload),
        new ShowSuccessSnackbar(SAVE_SUCCESS)
      ])
      .catch(() => Observable.of(new SetAdminSettingsFailure(
        'We weren\'t able to save your settings this time. Please, try again later'
      )))
    );

  @Effect()
  getPrivacySettings$ = this.actions$
    .ofType(GET_PRIVACY_SETTINGS)
    .map(toPayload)
    .switchMap(() => this.service.getPrivacySettings()
      .map((privacyData) => new GetPrivacySettingsSuccess(privacyData))
      .catch((err) => {
        if (err.status === HTTP_NOT_FOUND) {
          return Observable.of();
        }
        return Observable.of(new GetPrivacySettingsFailure(
          'We weren\'t able to save your settings this time. Please, try again later'
        ))
      })
    );

  @Effect()
  getTermsSettings$ = this.actions$
    .ofType(GET_TERMS_SETTINGS)
    .map(toPayload)
    .switchMap(() => this.service.getTermsAndConditions()
      .map((termsData) => new GetTermsSettingsSuccess(termsData))
      .catch((err) => {
        if (err.status === HTTP_NOT_FOUND) {
          return Observable.of();
        }
        return Observable.of(new GetTermsSettingsFailure(
          'We weren\'t able to save your settings this time. Please, try again later'
        ));
      })
    );

  @Effect()
  setTermsSettings$ = this.actions$
    .ofType(SET_TERMS_SETTINGS)
    .map(toPayload)
    .switchMap((payload) => this.service.setTermsAndConditions(payload)
      .switchMap((termsData) => [
        new SetTermsSettingsSuccess(termsData),
        new ShowSuccessSnackbar(SAVE_SUCCESS)
      ])
      .catch(() => {
        return Observable.of(new SetPrivacySettingsFailure(
          'We weren\'t able to save your settings this time. Please, try again later'
        ))
      })
    );

  @Effect()
  setPrivacySettings$ = this.actions$
    .ofType(SET_PRIVACY_SETTINGS)
    .map(toPayload)
    .switchMap((payload) => this.service.setPrivacySettings(payload)
      .switchMap((termsData) => [
        new SetPrivacySettingsSuccess(termsData),
        new ShowSuccessSnackbar(SAVE_SUCCESS)
      ])
      .catch(() => {
        return Observable.of(new SetPrivacySettingsFailure(
          'We weren\'t able to save your settings this time. Please, try again later'
        ))
      })
    )

}
