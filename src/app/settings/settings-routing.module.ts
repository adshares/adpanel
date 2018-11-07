import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { BillingComponent } from './billing/billing.component';

const settingsRoutes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      {path: 'general', component: GeneralSettingsComponent},
      {path: 'billing', component: BillingComponent}
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
export class SettingsRoutingModule {
}
