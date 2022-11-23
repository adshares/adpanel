import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { AccountSettingsComponent } from './general-settings/account-settings/account-settings.component';
import { BillingComponent } from './billing/billing.component';
import { ReportsListWrapperComponent } from 'settings/reports-list-wrapper/reports-list-wrapper.component';
import { AccessTokenScopesResolver } from 'common/resolvers/access-token-scopes-resolver.service'
import { ServerOptionsResolver } from 'common/resolvers/server-options.resolver'

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
      },
      {
        path: 'billing',
        component: BillingComponent,
        children: [
          {path: 'now-payments/:status', component: BillingComponent}
        ]
      },
      {
        path: 'reports',
        component: ReportsListWrapperComponent,
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(settingsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SettingsRoutingModule {
}
