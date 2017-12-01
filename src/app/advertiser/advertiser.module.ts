import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppCommonModule } from '../common/common.module';

import { MatExpansionModule } from '@angular/material/expansion';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelDescription } from '@angular/material';

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

import { AdvertiserGuard } from './advertiser-guard.service';

const materialComponents = [
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelDescription
];

const editCampaignComponents = [
  EditCampaignComponent,
  EditCampaignBasicInformationComponent,
  EditCampaignAdditionalTargetingComponent,
  EditCampaignCreateAdsComponent,
  EditCampaignSummaryComponent,
  EditCampaignNavigationComponent
];

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    MatExpansionModule,
    AdvertiserRoutingModule
  ],
  providers: [
    AdvertiserGuard
  ],
  declarations: [
    AdvertiserComponent,
    CampaignListComponent,
    CampaignListItemComponent,
    ...editCampaignComponents,
    DashboardComponent
  ],
  exports: [
    ...materialComponents
  ]
})
export class AdvertiserModule { }
