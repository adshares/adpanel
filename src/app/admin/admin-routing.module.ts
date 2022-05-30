import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from './admin-guard.service';
import { AdminComponent } from './admin.component';
import { AccountSettingsComponent } from "settings/general-settings/account-settings/account-settings.component";
import { FinancesSettingsComponent } from "admin/finances/finances-settings.component";
import { GeneralSettingsComponent } from "admin/general-settings/general-settings.component";
import { RebrandingComponent } from 'admin/rebranding/rebranding.component';
import { PrivacyAndTermsSettingsComponent } from "admin/privacy-and-terms-settings/privacy-and-terms-settings.component";
import { UsersComponent } from "admin/users/users.component";
import { PanelPlaceholdersSettingsComponent } from 'admin/panel-placeholders-settings/panel-placeholders-settings.component';
import { MediaResolver } from 'common/resolvers/media.resolver'

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: '/admin/dashboard/general'},
      {
        path: 'dashboard',
        component: DashboardComponent,

        children: [
          {
            path: '',
            component: UsersComponent,
          },
          {
            path: 'general',
            component: GeneralSettingsComponent,
            resolve: {
              media: MediaResolver,
            }
          },
          {
            path: 'finance',
            component: FinancesSettingsComponent,
          },
          {
            path: 'account',
            component: AccountSettingsComponent,
          },
          {
            path: 'rebranding',
            component: RebrandingComponent,
          },
          {
            path: 'privacy',
            component: PrivacyAndTermsSettingsComponent,
          },
          {
            path: 'placeholders',
            component: PanelPlaceholdersSettingsComponent,
          },
          {
            path: 'users',
            component: UsersComponent
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(adminRoutes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {
}
