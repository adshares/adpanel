import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from './admin-guard.service';
import { AdminComponent } from './admin.component';
import { AccountSettingsComponent } from 'settings/general-settings/account-settings/account-settings.component';
import { GeneralSettingsComponent } from 'admin/general-settings/general-settings.component';
import { UsersComponent } from 'admin/users/users.component';
import { MediaResolver } from 'common/resolvers/media.resolver';
import { UserListComponent } from 'admin/users/user-list/user-list.component';
import { AdvertiserListComponent } from 'admin/users/advertiser-list/advertiser-list.component';
import { PublisherListComponent } from 'admin/users/publisher-list/publisher-list.component';
import { AccessTokenScopesResolver } from 'common/resolvers/access-token-scopes-resolver.service';
import { ServerOptionsResolver } from 'common/resolvers/server-options.resolver';
import { UserReportsComponent } from 'admin/user-reports/user-reports.component';
import { AccountWalletSettingsComponent } from 'settings/general-settings/ads-wallet-settings/account-wallet-settings.component';
import { PreferencesComponent } from 'settings/general-settings/preferences/preferences.component';
import { RefLinkSettingsComponent } from 'settings/general-settings/ref-link-settings/ref-link-settings.component';
import { AccessTokensComponent } from 'settings/general-settings/access-tokens/access-tokens.component';
import { NewsletterSettingsComponent } from 'settings/general-settings/newsletter-settings/newsletter-settings.component';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    resolve: {
      options: ServerOptionsResolver,
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/admin/dashboard/general' },
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
          {
            path: 'general',
            component: GeneralSettingsComponent,
            resolve: {
              media: MediaResolver,
            },
          },
          {
            path: 'account',
            component: AccountSettingsComponent,
            resolve: {
              scopes: AccessTokenScopesResolver,
            },
            children: [
              {
                path: '',
                redirectTo: 'wallet',
                pathMatch: 'full',
              },
              {
                path: 'wallet',
                component: AccountWalletSettingsComponent,
              },
              {
                path: 'preferences',
                component: PreferencesComponent,
              },
              {
                path: 'referrals',
                component: RefLinkSettingsComponent,
              },
              {
                path: 'access-token',
                component: AccessTokensComponent,
                resolve: {
                  scopes: AccessTokenScopesResolver,
                },
              },
              {
                path: 'newsletter',
                component: NewsletterSettingsComponent,
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
