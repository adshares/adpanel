import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatSelectModule } from '@angular/material/select'
import { MatChipsModule } from '@angular/material/chips'
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogContent,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSlideToggle,
  MatSnackBarModule,
  MatSpinner,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatExpansionModule } from '@angular/material/expansion'
import { ChartsModule } from 'ng2-charts'
import { ClickOutsideDirective } from './clickOutside.directive'
import { CommonService } from './common.service'
import { AccountChooseDialogComponent } from './dialog/account-choose-dialog/account-choose-dialog.component'
import { AdPreviewDialogComponent } from 'common/dialog/ad-preview-dialog/ad-preview-dialog.component'
import { LeaveEditProcessDialogComponent } from './dialog/leave-edit-process-dialog/leave-edit-process-dialog.component'
import { AddFundsDialogComponent } from './dialog/add-funds-dialog/add-funds-dialog.component'
import { ChangeAddressDialogComponent } from './dialog/change-address-dialog/change-address-dialog.component'
import { WithdrawFundsDialogComponent } from './dialog/withdraw-funds-dialog/withdraw-funds-dialog.component'
import { ChangeAutomaticWithdrawDialogComponent } from './dialog/change-automatic-withdraw-dialog/change-automatic-withdraw-dialog.component'
import { UserConfirmResponseDialogComponent } from './dialog/user-confirm-response-dialog/user-confirm-response-dialog.component'
import { HeaderComponent } from './components/header/header.component'
import { NotificationsComponent } from './components/notifications/notifications.component'
import { NotificationComponent } from './components/notifications/notification/notification.component'
import { PushNotificationsComponent } from './components/push-notifications/push-notifications.component'
import { PushNotificationComponent } from './components/push-notifications/push-notification/push-notification.component'
import { ChartComponent } from './components/chart/chart.component'
import { ChartFilterComponent } from './components/chart-filter/chart-filter.component'
import { ChartFilterByTypeComponent } from './components/chart-filter-by-type/chart-filter-by-type.component'
import {
  AdsharesBudgetPerDayPipe,
  AdsharesTokenPipe,
  CalculateInCurrency,
  ClickToADSPipe,
} from './pipes/adshares-token.pipe'
import { FormatFileSizePipe } from './pipes/format-file-size.pipe'
import { TestPlaceholdersPipe } from './pipes/test-placeholders.pipe'
import { TrustHtmlPipe, TrustUrlPipe } from './pipes/trust.pipe'
import { MomentDatePipe } from './pipes/moment-date.pipe'
import { AccountNotConfirmedBarComponent } from 'app/auth/account/not-confirmed-bar.component'
import { TargetingSelectComponent } from './components/targeting/targeting-select/targeting-select.component'
import { TargetingDisplayComponent } from './components/targeting/targeting-display/targeting-display.component'
import { TableNavigationComponent } from './components/table-navigation/table-navigation.component'
import { EditAssetNavigationComponent } from './components/edit-asset-navigation/edit-asset-navigation.component'
import { BidStrategyService } from 'common/bid-strategy.service'
import { ChartService } from './chart.service'
import { AssetHelpersService } from './asset-helpers.service'
import { PushNotificationsService } from './components/push-notifications/push-notifications.service'
import { WarningDialogComponent } from 'common/dialog/warning-dialog/warning-dialog.component'
import { BannerPreviewComponent } from 'common/components/banner-preview/banner-preview.component'
import { SettingsMenuItemComponent } from 'common/components/settings-menu-item/settings-menu-item.component'
import { SuccessSnackbarComponent } from 'common/dialog/success-snackbar/success-snackbar.component'
import { InputComponent } from 'common/components/input/input.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TargetingCustomOptionInputComponent } from 'common/components/targeting/targeting-custom-option-input/targeting-custom-option-input.component'
import { ConversionLinkInformationDialogComponent } from 'common/dialog/information-dialog/conversion-link-information-dialog.component'
import { LabelWithTooltipComponent } from 'common/components/labelWithTooltip/labelWithTooltip.component'
import { PlaceholdersAccordion } from 'common/components/placeholders-accordion/placeholders-accordion'
import { ReportsListComponent } from 'common/components/reports-list/reports-list.component'
import { ReportsListItemComponent } from 'common/components/reports-list/reports-list-item/reports-list-item.component'
import { BidStrategySettingsComponent } from 'common/components/bid-strategy/bid-strategy-settings/bid-strategy-settings.component'
import { InfoPageComponent } from 'common/info/info-page/info-page.component'
import { PageNotFoundComponent } from 'common/info/page-not-found/page-not-found.component'
import { SettingsNavigationComponent } from 'settings/settings-navigation/settings-navigation.component'

const matModules = [
  MatDialogModule,
  MatTooltipModule,
  MatSelectModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatInputModule,
  MatMomentDateModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatCheckboxModule,
  FontAwesomeModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatMenuModule,
]

const dialogs = [
  AccountChooseDialogComponent,
  AdPreviewDialogComponent,
  LeaveEditProcessDialogComponent,
  AddFundsDialogComponent,
  WithdrawFundsDialogComponent,
  ChangeAddressDialogComponent,
  ChangeAutomaticWithdrawDialogComponent,
  UserConfirmResponseDialogComponent,
  WarningDialogComponent,
  ConversionLinkInformationDialogComponent,
]

const appComponents = [
  HeaderComponent,
  NotificationsComponent,
  NotificationComponent,
  PushNotificationsComponent,
  PushNotificationComponent,
  AdsharesTokenPipe,
  FormatFileSizePipe,
  CalculateInCurrency,
  ClickToADSPipe,
  TestPlaceholdersPipe,
  TrustUrlPipe,
  TrustHtmlPipe,
  MomentDatePipe,
  AdsharesBudgetPerDayPipe,
  ChartComponent,
  ChartFilterComponent,
  ChartFilterByTypeComponent,
  AccountNotConfirmedBarComponent,
  TargetingSelectComponent,
  TargetingDisplayComponent,
  TargetingCustomOptionInputComponent,
  TableNavigationComponent,
  EditAssetNavigationComponent,
  BannerPreviewComponent,
  SettingsMenuItemComponent,
  SuccessSnackbarComponent,
  InputComponent,
  LabelWithTooltipComponent,
  PlaceholdersAccordion,
  ReportsListComponent,
  ReportsListItemComponent,
  BidStrategySettingsComponent,
  InfoPageComponent,
  PageNotFoundComponent,
  SettingsNavigationComponent,
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    ...matModules,
    MatExpansionModule,
  ],
  declarations: [
    ClickOutsideDirective,
    ...dialogs,
    ...appComponents,
  ],
  entryComponents: [
    ...dialogs,
  ],
  providers: [
    BidStrategyService,
    ChartService,
    CommonService,
    AssetHelpersService,
    PushNotificationsService,
  ],
  exports: [
    ...appComponents,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatSpinner,
    MatDialogContent,
    MatSlideToggle,
    MatIconModule,
  ],
})

export class AppCommonModule {
}
