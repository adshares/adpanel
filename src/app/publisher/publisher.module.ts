import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../common/common.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';

import { PublisherRoutingModule } from './publisher-routing.module';
import { PublisherGuard } from './publisher-guard.service';

import { PublisherComponent } from './publisher.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { SiteListComponent } from './site-list/site-list.component';
import { SiteListItemComponent } from './site-list/site-list-item/site-list-item.component';
import { EditSiteComponent } from './edit-site/edit-site.component';
import { EditSiteBasicInformationComponent } from './edit-site/edit-site-basic-info/edit-site-basic-information.component';
import { AdUnitsComponent } from './site-details/ad-units/ad-units.component';
import { SiteCodeDialogComponent } from './dialogs/site-code-dialog/site-code-dialog.component';
import { SiteResolver } from './site.resolver';

const editSiteComponents = [
  EditSiteComponent,
  EditSiteBasicInformationComponent
];

const publisherComponents = [
  PublisherComponent,
  DashboardComponent,
  SiteDetailsComponent,
  SiteListComponent,
  SiteListItemComponent,
  AdUnitsComponent,
  SiteCodeDialogComponent
];

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    PublisherRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule
  ],
  providers: [
    PublisherGuard,
    SiteResolver
  ],
  declarations: [
    ...publisherComponents,
    ...editSiteComponents
  ],
  entryComponents: [
    SiteCodeDialogComponent
  ]
})
export class PublisherModule { }
