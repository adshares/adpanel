import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppCommonModule } from '../common/common.module';
import { AdvertiserComponent } from './advertiser.component';
import { AdvertiserRoutingModule } from './advertiser-routing.module';
import { AdvertiserGuard } from './advertiser-guard.service';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignListItemComponent } from './campaign-list/campaign-list-item/campaign-list-item.component';

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
    AdvertiserComponent,
    CampaignListComponent,
    CampaignListItemComponent
  ]
})
export class AdvertiserModule { }
