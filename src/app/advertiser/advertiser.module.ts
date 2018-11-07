import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { FileUploadModule } from 'ng2-file-upload';

import { AppCommonModule } from 'common/common.module';
import { AdvertiserComponent } from './advertiser.component';
import { AdvertiserRoutingModule } from './advertiser-routing.module';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignListItemComponent } from './campaign-list/campaign-list-item/campaign-list-item.component';
import { EditCampaignBasicInformationComponent } from './edit-campaign/edit-campaign-basic-info/edit-campaign-basic-information.component';
import { EditCampaignAdditionalTargetingComponent } from './edit-campaign/edit-campaign-additional-targeting/edit-campaign-additional-targeting.component';
import { EditCampaignCreateAdsComponent } from './edit-campaign/edit-campaign-create-ads/edit-campaign-create-ads.component';
import { EditCampaignSummaryComponent } from './edit-campaign/edit-campaign-summary/edit-campaign-summary.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { AdListComponent } from './campaign-details/ad-list/ad-list.component';
import { AdListItemComponent } from './campaign-details/ad-list/ad-list-item/ad-list-item.component';

import { CampaignBudgetPerDayPipe } from "common/pipes/campaign-budget-per-day.pipe";
import { TrustHtmlPipe, TrustUrlPipe } from 'common/pipes/trust.pipe';
import { AdvertiserGuard } from './advertiser-guard.service';
import { CampaignResolver } from './resolvers/campaign.resolver';
import { TargetingCriteriaResolver } from './resolvers/targeting-criteria.resolver';

const matModules = [
  MatExpansionModule,
  MatFormFieldModule,
  MatMomentDateModule,
  MatDatepickerModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule
];

const editCampaignComponents = [
  EditCampaignComponent,
  EditCampaignBasicInformationComponent,
  EditCampaignAdditionalTargetingComponent,
  EditCampaignCreateAdsComponent,
  EditCampaignSummaryComponent
];

const advertiserComponents = [
  AdvertiserComponent,
  CampaignListComponent,
  CampaignListItemComponent,
  DashboardComponent,
  CampaignDetailsComponent,
  AdListComponent,
  AdListItemComponent
];

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    AppCommonModule,
    AdvertiserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    ...matModules
  ],
  providers: [
    AdvertiserGuard,
    CampaignResolver,
    TargetingCriteriaResolver
  ],
  declarations: [
    CampaignBudgetPerDayPipe,
    TrustUrlPipe,
    TrustHtmlPipe,
    ...advertiserComponents,
    ...editCampaignComponents
  ]
})
export class AdvertiserModule {
}
