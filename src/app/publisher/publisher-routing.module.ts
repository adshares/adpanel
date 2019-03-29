import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublisherComponent } from './publisher.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClassifierComponent } from './classifier/classifier.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { EditSiteComponent } from './edit-site/edit-site.component';
import { EditSiteBasicInformationComponent } from './edit-site/edit-site-basic-info/edit-site-basic-information.component';
import { EditSiteAdditionalTargetingComponent } from './edit-site/edit-site-additional-targeting/edit-site-additional-targeting.component';
import { EditSiteCreateAdUnitsComponent } from './edit-site/edit-site-create-ad-units/edit-site-create-ad-units.component';
import { EditSiteSummaryComponent } from './edit-site/edit-site-summary/edit-site-summary.component';

import { PublisherGuard } from './publisher-guard.service';
import { SiteResolver } from './resolvers/site.resolver';
import { FilteringCriteriaResolver } from './resolvers/filtering-criteria.resolver';
import { AdUnitSizesResolver } from './resolvers/ad-unit-sizes.resolver';
import { MatchingBannerSizesResolver } from "publisher/resolvers/matching-banner-sizes.resolver";
import { LanguagesListResolver } from "publisher/resolvers/languages-list.resolver";

const publisherRoutes: Routes = [
  {
    path: 'publisher',
    component: PublisherComponent,
    canActivate: [PublisherGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: '/advertiser/dashboard'},
      {path: 'dashboard', component: DashboardComponent},
      {
        path: 'site/:id',
        resolve: {
          site: SiteResolver,
          languagesList: LanguagesListResolver,
          filteringOptions: FilteringCriteriaResolver
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: SiteDetailsComponent,
          },
          {
            path: 'classifier',
            component: ClassifierComponent,
            resolve: {sizes: MatchingBannerSizesResolver}
          }
        ]
      },
      {
        path: 'create-site',
        component: EditSiteComponent,
        resolve: {filteringOptions: FilteringCriteriaResolver},
        children: [
          {
            resolve: {languagesList: LanguagesListResolver},
            path: 'basic-information',
            component: EditSiteBasicInformationComponent,
          },
          {
            path: 'additional-filtering',
            component: EditSiteAdditionalTargetingComponent,
          },
          {
            path: 'create-ad-units',
            component: EditSiteCreateAdUnitsComponent,
            resolve: {adUnitSizes: AdUnitSizesResolver}
          },
          {
            path: 'summary',
            component: EditSiteSummaryComponent
          }
        ]
      },
      {
        path: 'edit-site',
        component: EditSiteComponent,
        resolve: {filteringOptions: FilteringCriteriaResolver},
        children: [
          {
            resolve: {languagesList: LanguagesListResolver},
            path: 'basic-information',
            component: EditSiteBasicInformationComponent,
          },
          {
            path: 'additional-filtering',
            component: EditSiteAdditionalTargetingComponent,
          },
          {
            path: 'create-ad-units',
            component: EditSiteCreateAdUnitsComponent,
            resolve: {adUnitSizes: AdUnitSizesResolver}
          },
          {
            path: 'summary',
            component: EditSiteSummaryComponent
          }
        ]
      },
      {
        path: 'classifier',
        component: ClassifierComponent,
        resolve: {sizes: MatchingBannerSizesResolver}
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(publisherRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PublisherRoutingModule {
}
