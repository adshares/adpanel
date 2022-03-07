import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdvertiserComponent } from './advertiser.component';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { EditCampaignBasicInformationComponent } from './edit-campaign/edit-campaign-basic-info/edit-campaign-basic-information.component';
import { EditCampaignBidStrategyComponent } from './edit-campaign/edit-campaign-bid-strategy/edit-campaign-bid-strategy.component';
import { EditCampaignConversionComponent } from './edit-campaign/edit-campaign-conversion/edit-campaign-conversion.component';
import { EditCampaignAdditionalTargetingComponent } from './edit-campaign/edit-campaign-additional-targeting/edit-campaign-additional-targeting.component';
import { EditCampaignCreateAdsComponent } from './edit-campaign/edit-campaign-create-ads/edit-campaign-create-ads.component';
import { EditCampaignSummaryComponent } from './edit-campaign/edit-campaign-summary/edit-campaign-summary.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { AdvertiserGuard } from './advertiser-guard.service';
import { CampaignResolver } from './resolvers/campaign.resolver';
import { TargetingCriteriaResolver } from './resolvers/targeting-criteria.resolver';
import { CampaignsConfigResolver } from 'advertiser/resolvers/campaigns-config.resolver';
import { FilteringCriteriaResolver } from 'publisher/resolvers/filtering-criteria.resolver';
import { BidStrategyDefaultResolver } from 'advertiser/resolvers/bid-strategy-default.resolver';
import { MediaResolver } from 'advertiser/resolvers/media.resolver'

const advertiserRoutes: Routes = [
  {
    path: 'advertiser',
    component: AdvertiserComponent,
    canActivate: [AdvertiserGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: '/advertiser/dashboard'},
      {
        path: 'dashboard',
        component: DashboardComponent,
        resolve: {
          filteringOptions: FilteringCriteriaResolver
        }
      },
      {
        path: 'campaign/:id',
        component: CampaignDetailsComponent,
        resolve: {
          bidStrategyDefaultUuid: BidStrategyDefaultResolver,
          campaignsConfig: CampaignsConfigResolver,
          targetingOptions: TargetingCriteriaResolver,
          filteringOptions: FilteringCriteriaResolver,
          campaign: CampaignResolver
        }
      },
      {
        path: 'create-campaign',
        component: EditCampaignComponent,
        resolve: {
          targetingOptions: TargetingCriteriaResolver,
        },
        children: [
          {
            path: 'basic-information',
            component: EditCampaignBasicInformationComponent,
            resolve: {
              media: MediaResolver,
            }
          },
          {
            path: 'additional-targeting',
            component: EditCampaignAdditionalTargetingComponent,
          },
          {
            path: 'create-ad',
            component: EditCampaignCreateAdsComponent,
          },
          {
            path: 'summary',
            component: EditCampaignSummaryComponent
          }
        ]
      },
      {
        path: 'edit-campaign/:id',
        component: EditCampaignComponent,
        resolve: {
          campaignsConfig: CampaignsConfigResolver,
          targetingOptions: TargetingCriteriaResolver,
          campaign: CampaignResolver,
        },
        children: [
          {
            path: 'basic-information',
            component: EditCampaignBasicInformationComponent,
            resolve: {
              media: MediaResolver,
            }
          },
          {
            path: 'bid-strategy',
            component: EditCampaignBidStrategyComponent,
          },
          {
            path: 'conversion',
            component: EditCampaignConversionComponent,
          },
          {
            path: 'additional-targeting',
            component: EditCampaignAdditionalTargetingComponent,
          },
          {
            path: 'create-ad',
            component: EditCampaignCreateAdsComponent,
          },
          {
            path: 'summary',
            component: EditCampaignSummaryComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(advertiserRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdvertiserRoutingModule {
}
