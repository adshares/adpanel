import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogContent, MatDialogModule, MatInputModule, MatSlideToggle, MatSpinner } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChartsModule } from 'ng2-charts';

import { ClickOutsideDirective } from './clickOutside.directive'

import { CommonService } from './common.service';
import { AccountChooseDialogComponent } from './dialog/account-choose-dialog/account-choose-dialog.component';
import { LeaveEditProcessDialogComponent } from './dialog/leave-edit-process-dialog/leave-edit-process-dialog.component';
import { AddFundsDialogComponent } from './dialog/add-funds-dialog/add-funds-dialog.component';
import { ChangeAddressDialogComponent } from './dialog/change-address-dialog/change-address-dialog.component';
import { WithdrawFundsDialogComponent } from './dialog/withdraw-funds-dialog/withdraw-funds-dialog.component';
import { ChangeAutomaticWithdrawDialogComponent } from './dialog/change-automatic-withdraw-dialog/change-automatic-withdraw-dialog.component';
import { AddCustomTargetingDialogComponent } from './dialog/add-custom-targeting-dialog/add-custom-targeting-dialog.component';
import { UserConfirmResponseDialogComponent } from './dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';

import { HeaderComponent } from './components/header/header.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationComponent } from './components/notifications/notification/notification.component';
import { PushNotificationsComponent } from './components/push-notifications/push-notifications.component';
import { PushNotificationComponent } from './components/push-notifications/push-notification/push-notification.component';
import { ChartComponent } from './components/chart/chart.component';
import { ChartFilterComponent } from './components/chart-filter/chart-filter.component';
import { ChartFilterByTypeComponent } from './components/chart-filter-by-type/chart-filter-by-type.component';
import { FundsSummaryComponent } from './components/funds-summary/funds-summary.component';
import { AdsharesTokenPipe } from './pipes/adshares-token.pipe';
import { TrustUrlPipe, TrustHtmlPipe } from './pipes/trust.pipe';
import { EmailNotActivatedBarComponent } from 'app/auth/email/not-activated-bar.component';
import { TargetingSelectComponent } from './components/targeting/targeting-select/targeting-select.component';
import { TargetingDisplayComponent } from './components/targeting/targeting-display/targeting-display.component';
import { TableNavigationComponent } from './components/table-navigation/table-navigation.component';
import { EditAssetNavigationComponent } from './components/edit-asset-navigation/edit-asset-navigation.component';

import { ChartService } from './chart.service';
import { AssetHelpersService } from './asset-helpers.service';
import { PushNotificationsService } from './components/push-notifications/push-notifications.service';
import {WarningDialogComponent} from "common/dialog/warning-dialog/warning-dialog.component";
import {BannerPreviewComponent} from "common/components/banner-preview/banner-preview.component";

const matModules = [
  MatDialogModule,
  MatSelectModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatInputModule,
  MatMomentDateModule,
  MatSlideToggleModule
];

const dialogs = [
  AccountChooseDialogComponent,
  LeaveEditProcessDialogComponent,
  AddFundsDialogComponent,
  WithdrawFundsDialogComponent,
  ChangeAddressDialogComponent,
  ChangeAutomaticWithdrawDialogComponent,
  AddCustomTargetingDialogComponent,
  UserConfirmResponseDialogComponent,
  WarningDialogComponent,
];

const appComponents = [
  HeaderComponent,
  NotificationsComponent,
  NotificationComponent,
  PushNotificationsComponent,
  PushNotificationComponent,
  AdsharesTokenPipe,
  TrustUrlPipe,
  TrustHtmlPipe,
  ChartComponent,
  ChartFilterComponent,
  ChartFilterByTypeComponent,
  FundsSummaryComponent,
  EmailNotActivatedBarComponent,
  TargetingSelectComponent,
  TargetingDisplayComponent,
  TableNavigationComponent,
  EditAssetNavigationComponent,
  BannerPreviewComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    ...matModules,
  ],
  declarations: [
    ClickOutsideDirective,
    ...dialogs,
    ...appComponents,
  ],
  entryComponents: [
    ...dialogs
  ],
  providers: [
    ChartService,
    CommonService,
    AssetHelpersService,
    PushNotificationsService
  ],
  exports: [
    ...appComponents,
    MatSpinner,
    MatDialogContent,
    MatSlideToggle
  ]
})

export class AppCommonModule {
}
