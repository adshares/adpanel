import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from '../common/common.module';

import { AdvertiserComponent } from './advertiser.component';
import { AdvertiserRoutingModule } from './advertiser-routing.module';
import { HeaderComponent } from '../common/components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    AdvertiserRoutingModule
  ],
  declarations: [
    AdvertiserComponent,
    HeaderComponent
  ]
})
export class AdvertiserModule { }
