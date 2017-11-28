import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from '../common/common.module';

import { AdvertiserComponent } from './advertiser.component';
import { AdvertiserRoutingModule } from './advertiser-routing.module';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { EditCampaignBasicInformationComponent } from './edit-campaign/edit-campaign-basic-info/edit-campaign-basic-information.component';
import { EditCampaignAdditionalTargetingComponent } from './edit-campaign/edit-campaign-additional-targeting/edit-campaign-additional-targeting.component';
import { EditCampaignCreateAdsComponent } from './edit-campaign/edit-campaign-create-ads/edit-campaign-create-ads.component';
import { EditCampaignSummaryComponent } from './edit-campaign/edit-campaign-summary/edit-campaign-summary.component';
import { EditCampaignNavigationComponent } from './edit-campaign/edit-campaign-navigation/edit-campaign-navigation.component';

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    AdvertiserRoutingModule
  ],
  declarations: [
    AdvertiserComponent,
    EditCampaignComponent,
    EditCampaignBasicInformationComponent,
    EditCampaignAdditionalTargetingComponent,
    EditCampaignCreateAdsComponent,
    EditCampaignSummaryComponent,
    EditCampaignNavigationComponent
  ]
})
export class AdvertiserModule { }
