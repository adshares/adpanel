import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
import {
  MatAutocompleteModule,
  MatOptionModule,
  MatFormFieldModule,
  MatInputModule,
  MatExpansionModule,
  MatSelectModule
} from "@angular/material";
import {PublisherRoutingModule} from './publisher-routing.module';
import {PublisherGuard} from './publisher-guard.service';
import {AppCommonModule} from 'common/common.module';
import {PublisherComponent} from './publisher.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SiteDetailsComponent} from './site-details/site-details.component';
import {SiteListComponent} from './site-list/site-list.component';
import {SiteListItemComponent} from './site-list/site-list-item/site-list-item.component';
import {EditSiteComponent} from './edit-site/edit-site.component';
import {EditSiteNavigationComponent} from './edit-site/edit-site-navigation/edit-site-navigation.component';
import {EditSiteBasicInformationComponent} from './edit-site/edit-site-basic-info/edit-site-basic-information.component';
import {EditSiteAdditionalTargetingComponent} from './edit-site/edit-site-additional-targeting/edit-site-additional-targeting.component';
import {EditSiteCreateAdUnitsComponent} from './edit-site/edit-site-create-ad-units/edit-site-create-ad-units.component';
import {EditSiteSummaryComponent} from './edit-site/edit-site-summary/edit-site-summary.component';
import {AdUnitsComponent} from './site-details/ad-units/ad-units.component';
import {SiteCodeDialogComponent} from './dialogs/site-code-dialog/site-code-dialog.component';
import {SiteResolver} from './resolvers/site.resolver';
import {FilteringCriteriaResolver} from './resolvers/filtering-criteria.resolver';
import {AdUnitSizesResolver} from './resolvers/ad-unit-sizes.resolver';
import {ClassifierComponent} from './classifier/classifier.component';
import {ClassifierListItemComponent} from './classifier/classifier-list-item/classifier-list-item.component';


const editSiteComponents = [
  EditSiteComponent,
  EditSiteNavigationComponent,
  EditSiteBasicInformationComponent,
  EditSiteAdditionalTargetingComponent,
  EditSiteCreateAdUnitsComponent,
  EditSiteSummaryComponent
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
];

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    PublisherRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    ChartsModule,
  ],
  providers: [
    PublisherGuard,
    SiteResolver,
    FilteringCriteriaResolver,
    AdUnitSizesResolver
  ],
  declarations: [
    ...publisherComponents,
    ...editSiteComponents
  ],
  entryComponents: [
    SiteCodeDialogComponent
  ]
})

export class PublisherModule {
}
