import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSelectModule,
  MatTabsModule,
} from '@angular/material';
import { PublisherRoutingModule } from './publisher-routing.module';
import { PublisherGuard } from './publisher-guard.service';
import { AppCommonModule } from 'common/common.module';
import { PublisherComponent } from './publisher.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { SiteListComponent } from './site-list/site-list.component';
import { SiteListItemComponent } from './site-list/site-list-item/site-list-item.component';
import { EditSiteComponent } from './edit-site/edit-site.component';
import { EditSiteNavigationComponent } from './edit-site/edit-site-navigation/edit-site-navigation.component';
import { EditSiteBasicInformationComponent } from './edit-site/edit-site-basic-info/edit-site-basic-information.component';
import { EditSiteAdditionalTargetingComponent } from './edit-site/edit-site-additional-targeting/edit-site-additional-targeting.component';
import { EditSitePopsSettingsComponent } from 'publisher/edit-site/edit-site-pops-settings/edit-site-pops-settings.component';
import { EditSiteCreateAdUnitsComponent } from './edit-site/edit-site-create-ad-units/edit-site-create-ad-units.component';
import { EditSiteSummaryComponent } from './edit-site/edit-site-summary/edit-site-summary.component';
import { AdUnitsComponent } from './site-details/ad-units/ad-units.component';
import { SiteCodeDialogComponent } from './dialogs/site-code-dialog/site-code-dialog.component';
import { ClassifierComponent } from './classifier/classifier.component';
import { ClassifierListItemComponent } from './classifier/classifier-list-item/classifier-list-item.component';
import { SiteResolver } from './resolvers/site.resolver';
import { FilteringCriteriaResolver } from './resolvers/filtering-criteria.resolver';
import { AdUnitSizesResolver } from './resolvers/ad-unit-sizes.resolver';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ClassifierFilteringComponent } from 'publisher/classifier/classifier-filtering/classifier-filtering.component';
import { MatchingBannerSizesResolver } from 'publisher/resolvers/matching-banner-sizes.resolver';
import { LanguagesListResolver } from 'publisher/resolvers/languages-list.resolver';
import { DomainCheckerComponent } from 'publisher/site-details/domain-checker/domain-checker.component';
import { TargetingCriteriaResolver } from 'publisher/resolvers/targeting-criteria.resolver'

library.add(fas);


const editSiteComponents = [
  EditSiteComponent,
  EditSiteNavigationComponent,
  EditSiteBasicInformationComponent,
  EditSitePopsSettingsComponent,
  EditSiteCreateAdUnitsComponent,
  EditSiteAdditionalTargetingComponent,
  EditSiteSummaryComponent,
];

const publisherComponents = [
  PublisherComponent,
  DashboardComponent,
  SiteDetailsComponent,
  SiteListComponent,
  SiteListItemComponent,
  AdUnitsComponent,
  SiteCodeDialogComponent,
  ClassifierComponent,
  ClassifierListItemComponent,
  ClassifierFilteringComponent,
  DomainCheckerComponent,
];

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    PublisherRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatExpansionModule,
    MatRadioModule,
    ChartsModule,
    FontAwesomeModule,
    MatTabsModule,
  ],
  providers: [
    PublisherGuard,
    SiteResolver,
    FilteringCriteriaResolver,
    AdUnitSizesResolver,
    MatchingBannerSizesResolver,
    LanguagesListResolver,
    TargetingCriteriaResolver,
  ],
  declarations: [
    ...publisherComponents,
    ...editSiteComponents,
  ],
  entryComponents: [
    SiteCodeDialogComponent,
  ]
})

export class PublisherModule {
}
