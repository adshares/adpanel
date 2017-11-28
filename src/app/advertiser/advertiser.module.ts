import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from '../common/common.module';

import { AdvertiserComponent } from './advertiser.component';
import { AdvertiserRoutingModule } from './advertiser-routing.module';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignListItemComponent } from './campaign-list/campaign-list-item/campaign-list-item.component';
import { EditCampaignBasicInformationComponent } from './edit-campaign/edit-campaign-basic-info/edit-campaign-basic-information.component';
import { EditCampaignAdditionalTargetingComponent } from './edit-campaign/edit-campaign-additional-targeting/edit-campaign-additional-targeting.component';
import { EditCampaignCreateAdsComponent } from './edit-campaign/edit-campaign-create-ads/edit-campaign-create-ads.component';
import { EditCampaignSummaryComponent } from './edit-campaign/edit-campaign-summary/edit-campaign-summary.component';
import { EditCampaignNavigationComponent } from './edit-campaign/edit-campaign-navigation/edit-campaign-navigation.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    AdvertiserRoutingModule
  ],
  declarations: [
    AdvertiserComponent,
    CampaignListComponent,
    CampaignListItemComponent
    EditCampaignComponent,
    EditCampaignBasicInformationComponent,
    EditCampaignAdditionalTargetingComponent,
    EditCampaignCreateAdsComponent,
    EditCampaignSummaryComponent,
    EditCampaignNavigationComponent
    AdvertiserComponent,
    DashboardComponent
  ]
})
export class AdvertiserModule { }
