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
import { RefLinkSettingsComponent } from 'settings/general-settings/ref-link-settings/ref-link-settings.component';
import { ClickOutsideDirective } from 'settings/clickOutside.directive';
import { ReportsListWrapperComponent } from 'settings/reports-list-wrapper/reports-list-wrapper.component';
import { RefLinkListItemComponent } from "settings/general-settings/ref-link-settings/ref-link-list-item/ref-link-list-item.component";
import { RefLinkEditorComponent } from "settings/general-settings/ref-link-settings/ref-link-editor/ref-link-editor.component";
import { RefLinkEditorDialogComponent } from "settings/general-settings/ref-link-settings/ref-link-editor-dialog/ref-link-editor-dialog.component";
import {OwlDateTimeModule} from "ng-pick-datetime";
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
    FontAwesomeModule,
    OwlDateTimeModule,
  ],
  declarations: [
    ClickOutsideDirective,
    SettingsComponent,
    BillingComponent,
    AccountSettingsComponent,
    PreferencesComponent,
    RefLinkSettingsComponent,
    RefLinkListItemComponent,
    RefLinkEditorComponent,
    RefLinkEditorDialogComponent,
    NewsletterSettingsComponent,
    NotificationSettingsComponent,
    UserWalletComponent,
    BillingHistoryComponent,
    BillingHistoryFilterComponent,
    SettingsNavigationComponent,
    BillingHistoryWithdrawalComponent,
    ReportsListWrapperComponent,
  ],
  entryComponents: [
    RefLinkEditorDialogComponent,
  ],
})
export class SettingsModule {
}
