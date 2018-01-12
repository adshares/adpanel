import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store/';

import { AppRoutingModule } from './app-routing.module';
import { AppCommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { AdvertiserModule } from './advertiser/advertiser.module';
import { PublisherModule } from './publisher/publisher.module';
import { SettingsModule } from './settings/settings.module'
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { AdvertiserService } from './advertiser/advertiser.service';
import { SettingsService } from './settings/settings.service';

import { EffectsModule } from '@ngrx/effects';
import { AdvertiserEffects } from './store/advertiser/advertiser.effects';
import { SettingsEffects } from './store/settings/settings.effects';

import { reducers } from './store/index';

const appModules = [
  AppCommonModule,
  AuthModule,
  AdvertiserModule,
  PublisherModule,
  SettingsModule
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ state: reducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([
      AdvertiserEffects,
      SettingsEffects
    ]),
    ...appModules
  ],
  providers: [
    AdvertiserService,
    SettingsService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
