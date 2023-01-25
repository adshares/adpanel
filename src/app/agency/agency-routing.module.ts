import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from 'agency/dashboard/dashboard.component';
import { AgencyGuard } from './agency-guard.service';
import { AdminComponent } from 'admin/admin.component';
import { UsersComponent } from 'admin/users/users.component';
import { UserListComponent } from 'admin/users/user-list/user-list.component';
import { AdvertiserListComponent } from 'admin/users/advertiser-list/advertiser-list.component';
import { PublisherListComponent } from 'admin/users/publisher-list/publisher-list.component';
import { ServerOptionsResolver } from 'common/resolvers/server-options.resolver';
import { UserReportsComponent } from 'admin/user-reports/user-reports.component';

const agencyRoutes: Routes = [
  {
    path: 'agency',
    component: AdminComponent,
    canActivate: [AgencyGuard],
    resolve: {
      options: ServerOptionsResolver,
    },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          {
            path: '',
            redirectTo: 'users',
            pathMatch: 'full',
          },
          {
            path: 'users',
            component: UsersComponent,
            children: [
              {
                path: '',
                redirectTo: 'all',
                pathMatch: 'full',
              },
              {
                path: 'all',
                component: UserListComponent,
              },
              {
                path: 'advertisers',
                component: AdvertiserListComponent,
              },
              {
                path: 'publishers',
                component: PublisherListComponent,
              },
              {
                path: 'reports',
                component: UserReportsComponent,
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(agencyRoutes)],
  exports: [RouterModule],
})
export class AgencyRoutingModule {}
