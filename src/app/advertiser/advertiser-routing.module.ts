import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertiserComponent } from './advertiser.component';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { EditCampaignBasicInformationComponent } from './edit-campaign/edit-campaign-basic-info/edit-campaign-basic-information.component';
import { EditCampaignAdditionalTargetingComponent } from './edit-campaign/edit-campaign-additional-targeting/edit-campaign-additional-targeting.component';
import { EditCampaignCreateAdsComponent } from './edit-campaign/edit-campaign-create-ads/edit-campaign-create-ads.component';
import { EditCampaignSummaryComponent } from './edit-campaign/edit-campaign-summary/edit-campaign-summary.component';

const advertiserRoutes: Routes = [
  {
    path: 'advertiser',
    component: AdvertiserComponent,
    children: [
      {
        path: 'create-campaign',
        component: EditCampaignComponent,
        children: [
          { path: 'basic-information', component: EditCampaignBasicInformationComponent },
          { path: 'additional-targeting', component: EditCampaignAdditionalTargetingComponent },
          { path: 'create-ad', component: EditCampaignCreateAdsComponent },
          { path: 'summary', component: EditCampaignSummaryComponent }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(advertiserRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdvertiserRoutingModule { }
