import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { DashboardComponent } from 'agency/dashboard/dashboard.component'
import { AgencyGuard } from './agency-guard.service'
import { AdminComponent } from 'admin/admin.component'
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
    RouterModule.forRoot(agencyRoutes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [
    RouterModule,
  ],
})

export class AgencyRoutingModule {
}
