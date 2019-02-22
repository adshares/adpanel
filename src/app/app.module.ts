import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppCommonModule } from './common/common.module';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { AdvertiserModule } from './advertiser/advertiser.module';
import { AdminModule } from './admin/admin.module';
import { PublisherModule } from './publisher/publisher.module';
import { SettingsModule } from './settings/settings.module';
import { AppComponent } from './app.component';

import { environment } from 'environments/environment';

import { RequestInterceptor } from './common/request.interceptor';

import { AdvertiserService } from './advertiser/advertiser.service';
import { PublisherService } from './publisher/publisher.service';
import { SettingsService } from './settings/settings.service';
import { AdminService } from './admin/admin.service';
import { AuthService } from 'app/auth.service';
import { SessionService } from 'app/session.service';

import { AdvertiserEffects } from './store/advertiser/advertiser.effects';
import { PublisherEffects } from './store/publisher/publisher.effects';
import { SettingsEffects } from './store/settings/settings.effects';
import { AdminEffects } from './store/admin/admin.effects';
import { CommonEffects } from './store/common/common.effects';

import { reducer } from './store/index';

import { ConfirmResponseDialogComponent } from "common/dialog/confirm-response-dialog/confirm-response-dialog.component";
import { ErrorResponseDialogComponent } from "common/dialog/error-response-dialog/error-response-dialog.component";
const appModules = [
  AppCommonModule,
  AuthModule,
  AdvertiserModule,
  PublisherModule,
  SettingsModule,
  AdminModule
];
@NgModule({
  declarations: [
    AppComponent,
    ConfirmResponseDialogComponent,
    ErrorResponseDialogComponent,
  ],
  imports: [
    ApiModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({state: reducer}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([
      AdvertiserEffects,
      PublisherEffects,
      SettingsEffects,
      AdminEffects,
      CommonEffects
    ]),
    ...appModules
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    AdvertiserService,
    PublisherService,
    SettingsService,
    AdminService,
    AuthService,
    SessionService,
    AppComponent,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmResponseDialogComponent,
    ErrorResponseDialogComponent,
  ]
})
export class AppModule {
}
