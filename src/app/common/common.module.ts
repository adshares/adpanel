import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from '../common/components/header/header.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AdsharesTokenPipe } from './pipes/adshares-token.pipe';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  declarations: [
    HeaderComponent,
    NotificationsComponent,
    AdsharesTokenPipe
  ],
  exports: [
    HeaderComponent,
    NotificationsComponent,
    AdsharesTokenPipe
  ]
})

export class AppCommonModule { }
