import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';
import { CustomizeAccountChooseDialogComponent } from './dialog/customize-account-choose-dialog/customize-account-choose-dialog.component';
import { AccountChooseDialogComponent } from './dialog/account-choose-dialog/account-choose-dialog.component';
import { HeaderComponent } from '../common/components/header/header.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ChartFilterComponent } from './components/chart-filter/chart-filter.component';
import { FundsSummaryComponent } from './components/funds-summary/funds-summary.component';

import { AdsharesTokenPipe } from './pipes/adshares-token.pipe';
import { ConfirmationAlertComponent } from './components/confirmation-alert/confirmation-alert.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  declarations: [
    CustomizeAccountChooseDialogComponent,
    AccountChooseDialogComponent,
    HeaderComponent,
    NotificationsComponent,
    AdsharesTokenPipe,
    ChartFilterComponent,
    FundsSummaryComponent,
    ConfirmationAlertComponent
  ],
  entryComponents: [
    CustomizeAccountChooseDialogComponent,
    AccountChooseDialogComponent
  ],
  exports: [
    HeaderComponent,
    NotificationsComponent,
    AdsharesTokenPipe,
    ChartFilterComponent,
    FundsSummaryComponent,
    ConfirmationAlertComponent
  ]
})

export class AppCommonModule { }
