import { Injectable } from '@angular/core';
import {
  Actions,
  Effect,
  toPayload
} from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import {
  LOAD_USERS,
  LOAD_ADMIN_SETTINGS,
  SET_ADMIN_SETTINGS,
  LoadUsersSuccess,
  LoadUsersFailure,
  LoadAdminSettingsSuccess,
  LoadAdminSettingsFailure,
  SetAdminSettingsSuccess,
  SetAdminSettingsFailure,
  GET_PRIVACY_SETTINGS,
  GET_TERMS_SETTINGS,
  SetPrivacySettingsSuccess,
  SetPrivacySettingsFailure,
  GetPrivacySettingsFailure,
  GetPrivacySettingsSuccess,
  GetTermsSettingsSuccess,
  GetTermsSettingsFailure, SetTermsSettingsSuccess, SET_TERMS_SETTINGS, SET_PRIVACY_SETTINGS,
} from './admin.actions';
import { AdminService } from 'admin/admin.service';
import { Observable } from "rxjs";
import { ClickToADSPipe } from "common/pipes/adshares-token.pipe";
import { HTTP_NOT_FOUND } from "common/utilities/codes";

@Injectable()
export class AdminEffects {
  constructor(
    private actions$: Actions,
    private service: AdminService,
    private clickToADSPipe: ClickToADSPipe
  ) {
  }

  @Effect()
  loadUsers$ = this.actions$
    .ofType(LOAD_USERS)
    .switchMap(() => this.service.getUsers()
      .map((users) => new LoadUsersSuccess(users))
      .catch((err) => Observable.of(new LoadUsersFailure(err)))
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
  saveAdminSettings$ = this.actions$
    .ofType(SET_ADMIN_SETTINGS)
    .map(toPayload)
    .switchMap((payload) => this.service.setAdminSettings(payload)
      .map(() => new SetAdminSettingsSuccess(payload))
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
        ))
      })
    );

  @Effect()
  setTermsSettings$ = this.actions$
    .ofType(SET_TERMS_SETTINGS)
    .map(toPayload)
    .switchMap((payload) => this.service.setTermsAndConditions(payload)
      .map((termsData) => new SetTermsSettingsSuccess(termsData))
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
      .map((termsData) => new SetPrivacySettingsSuccess(termsData))
      .catch(() => {
        return Observable.of(new SetPrivacySettingsFailure(
          'We weren\'t able to save your settings this time. Please, try again later'
        ))
      })
    )

}
