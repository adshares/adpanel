import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from "@angular/material";

import { SettingsRoutingModule } from './settings-routing.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import { AppCommonModule } from 'common/common.module';
import { WalletDialogComponent } from './dialogs/wallet-dialog/wallet-dialog.component';
import { SettingsComponent } from './settings.component';
import { BillingComponent } from './billing/billing.component';
import { AccountSettingsComponent } from './general-settings/account-settings/account-settings.component';
import { PreferencesComponent } from './general-settings/preferences/preferences.component';
import { NotificationSettingsComponent } from './general-settings/notification-settings/notification-settings.component';
import { UserWalletComponent } from './billing/user-wallet/user-wallet.component';
import { BillingHistoryComponent } from './billing/billing-history/billing-history.component';
import { SettingsNavigationComponent } from './settings-navigation/settings-navigation.component';
import { BillingHistoryWithdrawalComponent } from './billing/billing-history/billing-history-withdrawal/billing-history-withdrawal.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    SettingsRoutingModule,
    FontAwesomeModule
  ],
  declarations: [
    WalletDialogComponent,
    SettingsComponent,
    BillingComponent,
    AccountSettingsComponent,
    PreferencesComponent,
    NotificationSettingsComponent,
    UserWalletComponent,
    BillingHistoryComponent,
    SettingsNavigationComponent,
    BillingHistoryWithdrawalComponent,
  ],
  entryComponents: [
    WalletDialogComponent
  ]
})
export class SettingsModule {
}
