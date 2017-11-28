import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from '../common/components/header/header.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ChartFilterComponent } from './components/chart-filter/chart-filter.component';
import { FundsSummaryComponent } from './components/funds-summary/funds-summary.component';

import { AdsharesTokenPipe } from './pipes/adshares-token.pipe';
import { ConfirmationAlertComponent } from './components/confirmation-alert/confirmation-alert.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule
  ],
  declarations: [
    HeaderComponent,
    NotificationsComponent,
    AdsharesTokenPipe,
    ChartFilterComponent,
    FundsSummaryComponent,
    ConfirmationAlertComponent
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
