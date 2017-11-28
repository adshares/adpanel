import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertiserComponent } from './advertiser.component';
import { AdvertiserGuard } from './advertiser-guard.service';

const advertiserRoutes: Routes = [
  { path: 'advertiser', component: AdvertiserComponent, canActivate: [AdvertiserGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(advertiserRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdvertiserRoutingModule { }
