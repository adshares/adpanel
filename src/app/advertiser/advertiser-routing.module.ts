import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertiserComponent } from './advertiser.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { CreateCampaignBasicInformationComponent } from './create-campaign/create-campaign-basic-information/create-campaign-basic-information.component';
import { CreateCampaignAdditionalTargetingComponent } from './create-campaign/create-campaign-additional-targeting/create-campaign-additional-targeting.component';
import { CreateCampaignCreateAdsComponent } from './create-campaign/create-campaign-create-ads/create-campaign-create-ads.component';
import { CreateCampaignSummaryComponent } from './create-campaign/create-campaign-summary/create-campaign-summary.component';

const advertiserRoutes: Routes = [
  {
    path: 'advertiser',
    component: AdvertiserComponent,
    children: [
      {
        path: 'create-campaign',
        component: CreateCampaignComponent,
        children: [
          { path: '', redirectTo: 'basic-information', pathMatch: 'full'},
          { path: 'basic-information', component: CreateCampaignBasicInformationComponent },
          { path: 'additional-targeting', component: CreateCampaignAdditionalTargetingComponent },
          { path: 'create-ad', component: CreateCampaignCreateAdsComponent },
          { path: 'summary', component: CreateCampaignSummaryComponent }
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
