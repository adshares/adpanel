import { reducer } from 'store/index';
import { environment } from 'environments/environment';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BrowserModule } from '@angular/platform-browser';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppCommonModule } from 'common/common.module';
import { ApiModule } from './api/api.module';
import { AuthModule } from 'auth/auth.module';
import { AdvertiserModule } from 'advertiser/advertiser.module';
import { AdminModule } from 'admin/admin.module';
import { ModeratorModule } from 'moderator/moderator.module';
import { PublisherModule } from 'publisher/publisher.module';
import { SettingsModule } from 'settings/settings.module';
import { AppComponent } from './app.component';
import { RequestInterceptor } from 'common/request.interceptor';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { PublisherService } from 'publisher/publisher.service';
import { SettingsService } from 'settings/settings.service';
import { AdminService } from 'admin/admin.service';
import { AuthService } from 'app/auth.service';
import { SessionService } from 'app/session.service';
import { AdvertiserEffects } from 'store/advertiser/advertiser.effects';
import { PublisherEffects } from 'store/publisher/publisher.effects';
import { SettingsEffects } from 'store/settings/settings.effects';
import { AdminEffects } from 'store/admin/admin.effects';
import { AuthEffects } from 'store/auth/auth.effects';
import { CommonEffects } from 'store/common/common.effects';
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_PICKER_FORMATS } from 'common/utilities/consts';
import { ImpersonationService } from './impersonation/impersonation.service';
import { ImpersonationModule } from './impersonation/impersonation.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppErrorRoutingModule } from './app-error-routing.module';
import { AgencyModule } from 'agency/agency.module';

const appModules = [
  AppCommonModule,
  AuthModule,
  AdvertiserModule,
  PublisherModule,
  SettingsModule,
  AdminModule,
  ModeratorModule,
  AgencyModule,
];

@NgModule({
  declarations: [AppComponent, ConfirmResponseDialogComponent, ErrorResponseDialogComponent],
  imports: [
    ApiModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ImpersonationModule,
    StoreModule.forRoot({ state: reducer }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([
      AdvertiserEffects,
      PublisherEffects,
      SettingsEffects,
      AdminEffects,
      CommonEffects,
      AuthEffects,
    ]),
    ...appModules,
    AppErrorRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_PICKER_FORMATS },
    AdvertiserService,
    PublisherService,
    SettingsService,
    AdminService,
    AuthService,
    SessionService,
    ImpersonationService,
    AppComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
