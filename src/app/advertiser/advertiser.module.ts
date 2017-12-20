import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppCommonModule } from '../common/common.module';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material';

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
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { AdListComponent } from './campaign-details/ad-list/ad-list.component';
import { AdListItemComponent } from './campaign-details/ad-list/ad-list-item/ad-list-item.component';

import { AdvertiserGuard } from './advertiser-guard.service';
import { CampaignResolver } from './campaign.resolver';

const matModules = [
  MatExpansionModule,
  MatFormFieldModule,
  MatMomentDateModule,
  MatDatepickerModule,
  MatInputModule
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
    HttpModule,
    AppCommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...matModules,
    AdvertiserRoutingModule
  ],
  providers: [
    AdvertiserGuard,
    CampaignResolver
  ],
  declarations: [
    AdvertiserComponent,
    CampaignListComponent,
    CampaignListItemComponent,
    ...editCampaignComponents,
    DashboardComponent,
    CampaignDetailsComponent,
    AdListComponent,
    AdListItemComponent
  ]
})
export class AdvertiserModule { }
