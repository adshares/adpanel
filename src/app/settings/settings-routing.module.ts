import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { AccountSettingsComponent } from './general-settings/account-settings/account-settings.component';
import { BillingComponent } from './billing/billing.component';
import { ReportsListWrapperComponent } from 'settings/reports-list-wrapper/reports-list-wrapper.component';
import { AccessTokenScopesResolver } from 'common/resolvers/access-token-scopes-resolver.service';
import { ServerOptionsResolver } from 'common/resolvers/server-options.resolver';
import { AccountWalletSettingsComponent } from 'settings/general-settings/ads-wallet-settings/account-wallet-settings.component';
import { PreferencesComponent } from 'settings/general-settings/preferences/preferences.component';
import { RefLinkSettingsComponent } from 'settings/general-settings/ref-link-settings/ref-link-settings.component';
import { AccessTokensComponent } from 'settings/general-settings/access-tokens/access-tokens.component';
import { NewsletterSettingsComponent } from 'settings/general-settings/newsletter-settings/newsletter-settings.component';
import { UserWalletComponent } from 'settings/billing/user-wallet/user-wallet.component';
import { BillingHistoryComponent } from 'settings/billing/billing-history/billing-history.component';

const settingsRoutes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    resolve: {
      options: ServerOptionsResolver,
    },
    children: [
      {
        path: 'general',
        component: AccountSettingsComponent,
        resolve: {
          scopes: AccessTokenScopesResolver,
        },
        children: [
          {
            path: '',
            redirectTo: 'wallet',
            pathMatch: 'full',
          },
          {
            path: 'wallet',
            component: AccountWalletSettingsComponent,
          },
          {
            path: 'preferences',
            component: PreferencesComponent,
          },
          {
            path: 'referrals',
            component: RefLinkSettingsComponent,
          },
          {
            path: 'access-token',
            component: AccessTokensComponent,
            resolve: {
              scopes: AccessTokenScopesResolver,
            },
          },
          {
            path: 'newsletter',
            component: NewsletterSettingsComponent,
          },
        ],
      },
      {
        path: 'billing',
        component: BillingComponent,
        children: [
          { path: 'now-payments/:status', component: BillingComponent },
          {
            path: '',
            redirectTo: 'wallet',
            pathMatch: 'full',
          },
          {
            path: 'wallet',
            component: UserWalletComponent,
          },
          {
            path: 'history',
            component: BillingHistoryComponent,
          },
        ],
      },
      {
        path: 'reports',
        component: ReportsListWrapperComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(settingsRoutes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
