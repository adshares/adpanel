import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { CustomizeAccountChooseDialogComponent } from './dialog/customize-account-choose-dialog/customize-account-choose-dialog.component';
import { AccountChooseDialogComponent } from './dialog/account-choose-dialog/account-choose-dialog.component';
import { HeaderComponent } from '../common/components/header/header.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AdsharesTokenPipe } from './pipes/adshares-token.pipe';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    CustomizeAccountChooseDialogComponent,
    AccountChooseDialogComponent,
    HeaderComponent,
    NotificationsComponent,
    AdsharesTokenPipe
  ],
  entryComponents: [
    CustomizeAccountChooseDialogComponent,
    AccountChooseDialogComponent
  ],
  exports: [
    HeaderComponent,
    NotificationsComponent,
    AdsharesTokenPipe
  ]
})

export class AppCommonModule { }
