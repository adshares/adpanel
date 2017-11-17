import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertiserComponent } from './advertiser.component';

const advertiserRoutes: Routes = [
  { path: 'advertiser', component: AdvertiserComponent },
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
