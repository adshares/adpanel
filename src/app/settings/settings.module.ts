import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { SettingsRoutingModule } from './settings-routing.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AppCommonModule } from 'common/common.module';
import { SettingsComponent } from './settings.component';
import { BillingComponent } from './billing/billing.component';
import { AccountSettingsComponent } from './general-settings/account-settings/account-settings.component';
import { PreferencesComponent } from './general-settings/preferences/preferences.component';
import { NewsletterSettingsComponent } from './general-settings/newsletter-settings/newsletter-settings.component';
import { UserWalletComponent } from './billing/user-wallet/user-wallet.component';
import { BillingHistoryComponent } from './billing/billing-history/billing-history.component';
import { BillingHistoryFilterComponent } from 'settings/billing/billing-history/billing-history-filter/billing-history-filter.component';
import { BillingHistoryWithdrawalComponent } from './billing/billing-history/billing-history-withdrawal/billing-history-withdrawal.component';
import { RefLinkSettingsComponent } from 'settings/general-settings/ref-link-settings/ref-link-settings.component';
import { ClickOutsideDirective } from 'settings/clickOutside.directive';
import { AccessTokenDialogComponent } from 'settings/dialogs/access-token-dialog/access-token-dialog.component';
import { ReportsListWrapperComponent } from 'settings/reports-list-wrapper/reports-list-wrapper.component';
import { RefLinkListItemComponent } from 'settings/general-settings/ref-link-settings/ref-link-list-item/ref-link-list-item.component';
import { RefLinkEditorComponent } from 'settings/general-settings/ref-link-settings/ref-link-editor/ref-link-editor.component';
import { RefLinkEditorDialogComponent } from 'settings/general-settings/ref-link-settings/ref-link-editor-dialog/ref-link-editor-dialog.component';
import { AccountWalletSettingsComponent } from 'settings/general-settings/ads-wallet-settings/account-wallet-settings.component';
import { AccessTokensComponent } from 'settings/general-settings/access-tokens/access-tokens.component';
import { AccessTokenListItemComponent } from 'settings/general-settings/access-tokens/access-token-list-item/access-token-list-item.component';
import { AutoWithdrawalComponent } from 'settings/general-settings/auto-withdrawal/auto-withdrawal.component';

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
    MatRadioModule,
    SettingsRoutingModule,
    FontAwesomeModule,
  ],
  declarations: [
    AccessTokenDialogComponent,
    AccessTokenListItemComponent,
    AccessTokensComponent,
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
    UserWalletComponent,
    AutoWithdrawalComponent,
    BillingHistoryComponent,
    BillingHistoryFilterComponent,
    BillingHistoryWithdrawalComponent,
    ReportsListWrapperComponent,
    AccountWalletSettingsComponent,
  ],
})
export class SettingsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
