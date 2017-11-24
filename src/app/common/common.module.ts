import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';
import { CustomizeAccountChooseDialogComponent } from './dialog/customize-account-choose-dialog/customize-account-choose-dialog.component';
import { HeaderComponent } from '../common/components/header/header.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AdsharesTokenPipe } from './pipes/adshares-token.pipe';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  declarations: [
    CustomizeAccountChooseDialogComponent,
    HeaderComponent,
    NotificationsComponent,
    AdsharesTokenPipe
  ],
  entryComponents: [
    CustomizeAccountChooseDialogComponent
  ],
  exports: [
    HeaderComponent,
    NotificationsComponent,
    AdsharesTokenPipe
  ]
})

export class AppCommonModule { }
