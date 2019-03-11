import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from './admin-guard.service';
import { AdminComponent } from './admin.component';
import { GeneralSettingsComponent } from "settings/general-settings/general-settings.component";
import { UserListComponent } from "admin/user-list/user-list.component";
import { EarningsComponent } from "admin/earnings/earnings.component";

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: '/admin/dashboard'},
      {
        path: 'dashboard',
        component: DashboardComponent,

        children: [
          {
            path: '',
            component: GeneralSettingsComponent,
          },
          {
            path: 'params',
            component: UserListComponent,
          },
          {
            path: 'earnings',
            component: EarningsComponent,

          },
          {
            path: 'general',
            component: GeneralSettingsComponent,

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
