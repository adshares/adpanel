import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule
} from '@angular/material';

import { SettingsRoutingModule } from './settings-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppCommonModule } from 'common/common.module';
import { SettingsComponent } from './settings.component';
import { BillingComponent } from './billing/billing.component';
import { AccountSettingsComponent } from './general-settings/account-settings/account-settings.component';
import { PreferencesComponent } from './general-settings/preferences/preferences.component';
import { NewsletterSettingsComponent } from './general-settings/newsletter-settings/newsletter-settings.component';
import { NotificationSettingsComponent } from './general-settings/notification-settings/notification-settings.component';
import { UserWalletComponent } from './billing/user-wallet/user-wallet.component';
import { BillingHistoryComponent } from './billing/billing-history/billing-history.component';
import { BillingHistoryFilterComponent } from 'settings/billing/billing-history/billing-history-filter/billing-history-filter.component';
import { SettingsNavigationComponent } from './settings-navigation/settings-navigation.component';
import { BillingHistoryWithdrawalComponent } from './billing/billing-history/billing-history-withdrawal/billing-history-withdrawal.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ReferrerComponent } from 'settings/general-settings/referrer/referrer.component';
import { ClickOutsideDirective } from 'settings/clickOutside.directive';
import { ReportsListWrapperComponent } from 'settings/reports-list-wrapper/reports-list-wrapper.component';
library.add(fas);

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    SettingsRoutingModule,
    FontAwesomeModule
  ],
  declarations: [
    ClickOutsideDirective,
    SettingsComponent,
    BillingComponent,
    AccountSettingsComponent,
    PreferencesComponent,
    ReferrerComponent,
    NewsletterSettingsComponent,
    NotificationSettingsComponent,
    UserWalletComponent,
    BillingHistoryComponent,
    BillingHistoryFilterComponent,
    SettingsNavigationComponent,
    BillingHistoryWithdrawalComponent,
    ReportsListWrapperComponent,
  ]
})
export class SettingsModule {
}
