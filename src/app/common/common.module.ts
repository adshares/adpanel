import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NotificationsComponent } from './components/notifications/notifications.component';
import { AdsharesTokenPipe } from './pipes/adshares-token.pipe';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  declarations: [
    NotificationsComponent,
    AdsharesTokenPipe
  ],
  exports: [
    NotificationsComponent,
    AdsharesTokenPipe
  ]
})

export class AppCommonModule { }
