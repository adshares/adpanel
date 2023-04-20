import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgChartsModule } from 'ng2-charts';
import { ClickOutsideDirective } from './clickOutside.directive';
import { CommonService } from './common.service';
import { AccountChooseDialogComponent } from './dialog/account-choose-dialog/account-choose-dialog.component';
import { AdPreviewDialogComponent } from 'common/dialog/ad-preview-dialog/ad-preview-dialog.component';
import { AddFundsDialogComponent } from './dialog/add-funds-dialog/add-funds-dialog.component';
import { WithdrawFundsDialogComponent } from './dialog/withdraw-funds-dialog/withdraw-funds-dialog.component';
import { UserConfirmResponseDialogComponent } from './dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';
import { HeaderComponent } from './components/header/header.component';
import { ChartComponent } from './components/chart/chart.component';
import { ChartFilterComponent } from './components/chart-filter/chart-filter.component';
import { ChartFilterByTypeComponent } from './components/chart-filter-by-type/chart-filter-by-type.component';
import {
  AdsharesBudgetPerDayPipe,
  AdsharesTokenPipe,
  CalculateInCurrency,
  ClickToADSPipe,
  FormatNumberWithCommaPipe,
} from './pipes/adshares-token.pipe';
import { FormatFileSizePipe } from './pipes/format-file-size.pipe';
import { TestPlaceholdersPipe } from './pipes/test-placeholders.pipe';
import { TrustHtmlPipe, TrustUrlPipe } from './pipes/trust.pipe';
import { MomentDatePipe } from './pipes/moment-date.pipe';
import { AccountNotConfirmedBarComponent } from 'app/auth/account/not-confirmed-bar.component';
import { TargetingSelectComponent } from './components/targeting/targeting-select/targeting-select.component';
import { TargetingDisplayComponent } from './components/targeting/targeting-display/targeting-display.component';
import { TableNavigationComponent } from './components/table-navigation/table-navigation.component';
import { BidStrategyService } from 'common/bid-strategy.service';
import { ChartService } from './chart.service';
import { AssetHelpersService } from './asset-helpers.service';
import { WarningDialogComponent } from 'common/dialog/warning-dialog/warning-dialog.component';
import { BannerPreviewComponent } from 'common/components/banner-preview/banner-preview.component';
import { SettingsMenuItemComponent } from 'common/components/settings-menu-item/settings-menu-item.component';
import { SuccessSnackbarComponent } from 'common/dialog/success-snackbar/success-snackbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TargetingCustomOptionInputComponent } from 'common/components/targeting/targeting-custom-option-input/targeting-custom-option-input.component';
import { ConversionLinkInformationDialogComponent } from 'common/dialog/information-dialog/conversion-link-information-dialog.component';
import { LabelWithTooltipComponent } from 'common/components/labelWithTooltip/labelWithTooltip.component';
import { PlaceholdersAccordionComponent } from 'common/components/placeholders-accordion/placeholders-accordion.component';
import { ReportsListComponent } from 'common/components/reports-list/reports-list.component';
import { ReportsListItemComponent } from 'common/components/reports-list/reports-list-item/reports-list-item.component';
import { BidStrategySettingsComponent } from 'common/components/bid-strategy/bid-strategy-settings/bid-strategy-settings.component';
import { InfoPageComponent } from 'common/info/info-page/info-page.component';
import { Error4xxComponent } from 'common/info/page-not-found/error4xx.component';
import { ServiceUnavailableComponent } from 'common/info/service-unavailable/service-unavailable.component';
import { MediaResolver } from 'common/resolvers/media.resolver';
import { SettingsNavigationComponent } from 'settings/settings-navigation/settings-navigation.component';
import { ModelPreviewComponent } from 'common/components/model-preview/model-preview.component';
import { ServerOptionsService } from 'common/server-options.service';
import { AccessTokenScopesResolver } from 'common/resolvers/access-token-scopes-resolver.service';
import { ServerOptionsResolver } from 'common/resolvers/server-options.resolver';
import { HelperService } from 'common/helper.service';

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
];

const dialogs = [
  AccountChooseDialogComponent,
  AdPreviewDialogComponent,
  AddFundsDialogComponent,
  WithdrawFundsDialogComponent,
  UserConfirmResponseDialogComponent,
  WarningDialogComponent,
  ConversionLinkInformationDialogComponent,
];

const appComponents = [
  HeaderComponent,
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
  BannerPreviewComponent,
  ModelPreviewComponent,
  SettingsMenuItemComponent,
  SuccessSnackbarComponent,
  LabelWithTooltipComponent,
  PlaceholdersAccordionComponent,
  ReportsListComponent,
  ReportsListItemComponent,
  BidStrategySettingsComponent,
  InfoPageComponent,
  Error4xxComponent,
  ServiceUnavailableComponent,
  SettingsNavigationComponent,
  FormatNumberWithCommaPipe,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    ...matModules,
    MatExpansionModule,
  ],
  declarations: [ClickOutsideDirective, ...dialogs, ...appComponents],
  providers: [
    AccessTokenScopesResolver,
    AssetHelpersService,
    BidStrategyService,
    ChartService,
    CommonService,
    MediaResolver,
    ServerOptionsResolver,
    ServerOptionsService,
    HelperService,
  ],
  exports: [
    ...appComponents,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatDialogContent,
    MatProgressSpinnerModule,
    MatSlideToggle,
    MatIconModule,
  ],
})
export class AppCommonModule {}
