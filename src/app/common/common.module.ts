import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogContent, MatDialogModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSpinner, MatSlideToggle } from '@angular/material';
import { ChartsModule } from 'ng2-charts';

import { CommonService } from './common.service';
import { CustomizeAccountChooseDialogComponent } from './dialog/customize-account-choose-dialog/customize-account-choose-dialog.component';
import { AccountChooseDialogComponent } from './dialog/account-choose-dialog/account-choose-dialog.component';
import { LeaveEditProcessDialogComponent } from './dialog/leave-edit-process-dialog/leave-edit-process-dialog.component';
import { AddFundsDialogComponent } from './dialog/add-funds-dialog/add-funds-dialog.component';
import { ChangeAddressDialogComponent } from './dialog/change-address-dialog/change-address-dialog.component';
import { WithdrawFundsDialogComponent } from './dialog/withdraw-funds-dialog/withdraw-funds-dialog.component';
import { ChangeAutomaticWithdrawDialogComponent } from './dialog/change-automatic-withdraw-dialog/change-automatic-withdraw-dialog.component';
import { AddCustomTargetingDialogComponent } from './dialog/add-custom-targeting-dialog/add-custom-targeting-dialog.component';
import { EmailActivationResendConfirmDialogComponent } from "./dialog/email-activation-resend-confirm-dialog/email-activation-resend-confirm-dialog.component";
import { EmailActivationResendFailedConfirmDialogComponent } from "./dialog/email-activation-resend-failed-confirm-dialog/email-activation-resend-failed-confirm-dialog.component";

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
import { ConfirmationAlertComponent } from './components/confirmation-alert/confirmation-alert.component';
import { TargetingSelectComponent } from './components/targeting/targeting-select/targeting-select.component';
import { TargetingDisplayComponent } from './components/targeting/targeting-display/targeting-display.component';
import { TableNavigationComponent } from './components/table-navigation/table-navigation.component';
import { EditAssetNavigationComponent } from './components/edit-asset-navigation/edit-asset-navigation.component';
import { AccountConfirmedAlertComponent } from './components/account-confirmed-alert/account-confirmed-alert.component';

import { ChartService } from './chart.service';
import { AssetHelpersService } from './asset-helpers.service';
import { PushNotificationsService } from './components/push-notifications/push-notifications.service';

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
  CustomizeAccountChooseDialogComponent,
  AccountChooseDialogComponent,
  LeaveEditProcessDialogComponent,
  AddFundsDialogComponent,
  WithdrawFundsDialogComponent,
  ChangeAddressDialogComponent,
  ChangeAutomaticWithdrawDialogComponent,
  AddCustomTargetingDialogComponent,
  EmailActivationResendConfirmDialogComponent,
  EmailActivationResendFailedConfirmDialogComponent
];

const appComponents = [
  HeaderComponent,
  NotificationsComponent,
  NotificationComponent,
  PushNotificationsComponent,
  PushNotificationComponent,
  AdsharesTokenPipe,
  ChartComponent,
  ChartFilterComponent,
  ChartFilterByTypeComponent,
  FundsSummaryComponent,
  ConfirmationAlertComponent,
  TargetingSelectComponent,
  TargetingDisplayComponent,
  TableNavigationComponent,
  EditAssetNavigationComponent,
  AccountConfirmedAlertComponent
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

export class AppCommonModule { }
