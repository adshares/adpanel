import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdvertiserComponent } from './advertiser.component';
import { AdvertiserRoutingModule } from './advertiser-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AdvertiserRoutingModule
  ],
  declarations: [
    AdvertiserComponent
  ]
})
export class AdvertiserModule { }
