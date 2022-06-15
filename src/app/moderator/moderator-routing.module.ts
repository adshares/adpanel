import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { DashboardComponent } from 'moderator/dashboard/dashboard.component'
import { ModeratorGuard } from './moderator-guard.service'
import { AdminComponent } from 'admin/admin.component'
import { UsersComponent } from 'admin/users/users.component'
import { UserListComponent } from 'admin/users/user-list/user-list.component'
import { AdvertiserListComponent } from 'admin/users/advertiser-list/advertiser-list.component'
import { PublisherListComponent } from 'admin/users/publisher-list/publisher-list.component'

const moderatorRoutes: Routes = [
  {
    path: 'moderator',
    component: AdminComponent,
    canActivate: [ModeratorGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          {
            path: '',
            redirectTo: 'users',
            pathMatch: 'full'
          },
          {
            path: 'users',
            component: UsersComponent,
            children: [
              {
                path: '',
                redirectTo: 'all',
                pathMatch: 'full'
              },
              {
                path: 'all',
                component: UserListComponent
              },
              {
                path: 'advertisers',
                component: AdvertiserListComponent
              },
              {
                path: 'publishers',
                component: PublisherListComponent
              },
            ]
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
