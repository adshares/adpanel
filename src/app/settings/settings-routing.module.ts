import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { AccountSettingsComponent } from './general-settings/account-settings/account-settings.component';
import { BillingComponent } from './billing/billing.component';

const settingsRoutes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      {path: 'general', component: AccountSettingsComponent},
      {path: 'billing', component: BillingComponent}
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
