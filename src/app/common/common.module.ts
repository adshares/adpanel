import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from '../common/components/header/header.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ChartFilterComponent } from './components/chart-filter/chart-filter.component';
import { FundsSummaryComponent } from './components/funds-summary/funds-summary.component';

import { AdsharesTokenPipe } from './pipes/adshares-token.pipe';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  declarations: [
    HeaderComponent,
    NotificationsComponent,
    AdsharesTokenPipe,
    ChartFilterComponent,
    FundsSummaryComponent
  ],
  exports: [
    HeaderComponent,
    NotificationsComponent,
    AdsharesTokenPipe,
    ChartFilterComponent,
    FundsSummaryComponent
  ]
})

export class AppCommonModule { }
