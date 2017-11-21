import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppCommonModule } from './common/common.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AdvertiserModule } from './advertiser/advertiser.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    AdvertiserModule,
    AppCommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
