import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from '../common/common.module';

import { AdvertiserComponent } from './advertiser.component';
import { AdvertiserRoutingModule } from './advertiser-routing.module';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { CreateCampaignBasicInformationComponent } from './create-campaign/create-campaign-basic-information/create-campaign-basic-information.component';
import { CreateCampaignAdditionalTargetingComponent } from './create-campaign/create-campaign-additional-targeting/create-campaign-additional-targeting.component';
import { CreateCampaignCreateAdsComponent } from './create-campaign/create-campaign-create-ads/create-campaign-create-ads.component';
import { CreateCampaignSummaryComponent } from './create-campaign/create-campaign-summary/create-campaign-summary.component';
import { CreateCampaignNavigationComponent } from './create-campaign/create-campaign-navigation/create-campaign-navigation.component';

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    AdvertiserRoutingModule
  ],
  declarations: [
    AdvertiserComponent,
    CreateCampaignComponent,
    CreateCampaignBasicInformationComponent,
    CreateCampaignAdditionalTargetingComponent,
    CreateCampaignCreateAdsComponent,
    CreateCampaignSummaryComponent,
    CreateCampaignNavigationComponent
  ],
  exports: [
    CreateCampaignComponent,
    CreateCampaignBasicInformationComponent,
    CreateCampaignAdditionalTargetingComponent,
    CreateCampaignCreateAdsComponent,
    CreateCampaignSummaryComponent,
    CreateCampaignNavigationComponent
  ]
})
export class AdvertiserModule { }
