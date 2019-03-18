import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from './admin-guard.service';
import { AdminComponent } from './admin.component';
import { GeneralSettingsComponent as AccountSettingsComponent } from "settings/general-settings/general-settings.component";
import { GeneralSettingsComponent } from "admin/general-settings/general-settings.component";
import { FinancesSettingsComponent } from "admin/finances/finances-settings.component";

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
            component: GeneralSettingsComponent,
          },
          {
            path: 'general',
            component: GeneralSettingsComponent,
          },
          {
            path: 'earnings',
            component: FinancesSettingsComponent,
          },
          {
            path: 'account',
            component: AccountSettingsComponent,
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {
}
