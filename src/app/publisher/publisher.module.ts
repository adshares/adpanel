import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../common/common.module';

import { PublisherRoutingModule } from './publisher-routing.module';
import { PublisherGuard } from './publisher-guard.service';

import { PublisherComponent } from './publisher.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { SiteListComponent } from './site-list/site-list.component';
import { SiteListItemComponent } from './site-list/site-list-item/site-list-item.component';
import { AdUnitsComponent } from './site-details/ad-units/ad-units.component';
import { SiteCodeDialogComponent } from './dialogs/site-code-dialog/site-code-dialog.component';
import { SiteResolver } from './site.resolver';

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    PublisherRoutingModule
  ],
  providers: [
    PublisherGuard,
    SiteResolver
  ],
  declarations: [
    PublisherComponent,
    DashboardComponent,
    SiteDetailsComponent,
    SiteListComponent,
    SiteListItemComponent,
    AdUnitsComponent,
    SiteCodeDialogComponent
  ],
  entryComponents: [
    SiteCodeDialogComponent
  ]
})
export class PublisherModule { }
