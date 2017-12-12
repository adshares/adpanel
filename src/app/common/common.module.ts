import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

import { CustomizeAccountChooseDialogComponent } from './dialog/customize-account-choose-dialog/customize-account-choose-dialog.component';
import { AccountChooseDialogComponent } from './dialog/account-choose-dialog/account-choose-dialog.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ChartFilterComponent } from './components/chart-filter/chart-filter.component';
import { FundsSummaryComponent } from './components/funds-summary/funds-summary.component';
import { AdsharesTokenPipe } from './pipes/adshares-token.pipe';
import { ConfirmationAlertComponent } from './components/confirmation-alert/confirmation-alert.component';
import { TargetingCriteriaResolver } from './resolvers/targeting-criteria.resolver';
import { CommonService } from './common.service';
import { TargetingSelectComponent } from './components/targeting-select/targeting-select.component';
import { TargetingDisplayComponent } from './components/targeting-display/targeting-display.component';

const matModules = [
  MatDialogModule,
  MatSelectModule,
  MatChipsModule
];

const appComponents = [
  HeaderComponent,
  NotificationsComponent,
  AdsharesTokenPipe,
  ChartFilterComponent,
  FundsSummaryComponent,
  ConfirmationAlertComponent,
  TargetingSelectComponent,
  TargetingDisplayComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    ...matModules
  ],
  declarations: [
    CustomizeAccountChooseDialogComponent,
    AccountChooseDialogComponent,
    ...appComponents
  ],
  providers: [
    TargetingCriteriaResolver,
    CommonService
  ],
  entryComponents: [
    CustomizeAccountChooseDialogComponent,
    AccountChooseDialogComponent
  ],
  exports: [
    ...appComponents
  ]
})

export class AppCommonModule { }
