import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublisherComponent } from './publisher.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SiteDetailsComponent } from './site-details/site-details.component';

import { PublisherGuard } from './publisher-guard.service';

const publisherRoutes: Routes = [
  {
    path: 'publisher',
    component: PublisherComponent,
    canActivate: [PublisherGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/advertiser/dashboard' },
      { path: 'dashboard', component: DashboardComponent},
      { path: 'site/:id', component: SiteDetailsComponent}
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(publisherRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PublisherRoutingModule { }
