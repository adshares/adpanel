import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FileUploadModule } from 'ng2-file-upload';
import { NGX_MAT_DATE_FORMATS, NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppCommonModule } from 'common/common.module';
import { AdvertiserComponent } from './advertiser.component';
import { AdvertiserRoutingModule } from './advertiser-routing.module';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignListItemComponent } from './campaign-list/campaign-list-item/campaign-list-item.component';
import { EditCampaignBasicInformationComponent } from './edit-campaign/edit-campaign-basic-info/edit-campaign-basic-information.component';
import { EditCampaignBidStrategyComponent } from './edit-campaign/edit-campaign-bid-strategy/edit-campaign-bid-strategy.component';
import { EditCampaignConversionComponent } from './edit-campaign/edit-campaign-conversion/edit-campaign-conversion.component';
import { EditCampaignAdditionalTargetingComponent } from './edit-campaign/edit-campaign-additional-targeting/edit-campaign-additional-targeting.component';
import { EditCampaignCreateAdsComponent } from './edit-campaign/edit-campaign-create-ads/edit-campaign-create-ads.component';
import { EditCampaignSummaryComponent } from './edit-campaign/edit-campaign-summary/edit-campaign-summary.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { AdListComponent } from './campaign-details/ad-list/ad-list.component';
import { AdListItemComponent } from './campaign-details/ad-list/ad-list-item/ad-list-item.component';

import { CampaignBudgetPerDayPipe } from 'common/pipes/campaign-budget-per-day.pipe';
import { AdvertiserGuard } from './advertiser-guard.service';
import { CampaignResolver } from './resolvers/campaign.resolver';
import { DATE_AND_TIME_PICKER_FORMATS } from 'common/utilities/consts';
import { BannersConfigResolver } from 'advertiser/resolvers/banners-config.resolver';
import { CampaignsConfigResolver } from 'advertiser/resolvers/campaigns-config.resolver';
import { CampaignsMediaResolver } from 'advertiser/resolvers/campaigns-media.resolver';
import { CampaignClassificationInfoComponent } from 'advertiser/campaign-classification-info/campaign-classification-info.component';
import { EditCampaignNavigationComponent } from 'advertiser/edit-campaign/edit-campaign-navigation/edit-campaign-navigation.component';
import { TargetingReachComponent } from 'advertiser/edit-campaign/edit-campaign-additional-targeting/targeting-reach/targeting-reach.component';
import { MapToIterablePipe } from 'common/pipes/map-to-iterable.pipe';

const matModules = [
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatMomentDateModule,
  MatDatepickerModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatTabsModule,
];

const editCampaignComponents = [
  EditCampaignComponent,
  EditCampaignBasicInformationComponent,
  EditCampaignBidStrategyComponent,
  EditCampaignConversionComponent,
  EditCampaignAdditionalTargetingComponent,
  EditCampaignCreateAdsComponent,
  EditCampaignSummaryComponent,
];

const advertiserComponents = [
  AdvertiserComponent,
  CampaignListComponent,
  CampaignListItemComponent,
  CampaignClassificationInfoComponent,
  DashboardComponent,
  CampaignDetailsComponent,
  AdListComponent,
  AdListItemComponent,
  EditCampaignNavigationComponent,
  TargetingReachComponent,
];

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    AdvertiserRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    ...matModules,
    MatChipsModule,
  ],
  providers: [
    AdvertiserGuard,
    BannersConfigResolver,
    CampaignResolver,
    CampaignsConfigResolver,
    CampaignsMediaResolver,
    { provide: NGX_MAT_DATE_FORMATS, useValue: DATE_AND_TIME_PICKER_FORMATS },
  ],

  declarations: [CampaignBudgetPerDayPipe, MapToIterablePipe, ...advertiserComponents, ...editCampaignComponents],
})
export class AdvertiserModule {}
