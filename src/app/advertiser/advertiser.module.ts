import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppCommonModule } from '../common/common.module';
import { AdvertiserComponent } from './advertiser.component';
import { AdvertiserRoutingModule } from './advertiser-routing.module';
import { AdvertiserGuard } from './advertiser-guard.service';

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    AdvertiserRoutingModule
  ],
  providers: [
    AdvertiserGuard
  ],
  declarations: [
    AdvertiserComponent
  ]
})
export class AdvertiserModule { }
