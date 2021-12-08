import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { DashboardComponent } from 'agency/dashboard/dashboard.component'
import { AgencyGuard } from './agency-guard.service'
import { AdminComponent } from 'admin/admin.component'
import { AccountSettingsComponent } from 'settings/general-settings/account-settings/account-settings.component'
import { UsersComponent } from 'admin/users/users.component'

const agencyRoutes: Routes = [
  {
    path: 'agency',
    component: AdminComponent,
    canActivate: [AgencyGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,

        children: [
          {
            path: '',
            component: UsersComponent,
          },
          {
            path: 'account',
            component: AccountSettingsComponent,
          },
          {
            path: 'users',
            component: UsersComponent,
          },
        ],
      },
    ],
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(agencyRoutes),
  ],
  exports: [
    RouterModule,
  ],
})

export class AgencyRoutingModule {
}
