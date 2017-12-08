import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { BillingHistoryComponent } from './billing/billing-history/billing-history.component';

const settingsRoutes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      {
        path: 'general',
        component: GeneralSettingsComponent
      },
      {
        path: 'billing',
        component: BillingHistoryComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(settingsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SettingsRoutingModule { }
