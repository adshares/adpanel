import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { DashboardComponent } from 'moderator/dashboard/dashboard.component'
import { ModeratorGuard } from './moderator-guard.service'
import { ModeratorComponent } from './moderator.component'
import { AccountSettingsComponent } from 'settings/general-settings/account-settings/account-settings.component'
import { UsersComponent } from 'admin/users/users.component'

const moderatorRoutes: Routes = [
  {
    path: 'moderator',
    component: ModeratorComponent,
    canActivate: [ModeratorGuard],
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
    RouterModule.forRoot(moderatorRoutes),
  ],
  exports: [
    RouterModule,
  ],
})

export class ModeratorRoutingModule {
}
