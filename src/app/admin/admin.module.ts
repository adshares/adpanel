import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatDatepickerModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSliderModule
} from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { AppCommonModule } from 'common/common.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminGuard } from './admin-guard.service';
import { AdminComponent } from './admin.component';
import { BidStrategyComponent } from 'admin/general-settings/bid-strategy/bid-strategy.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserListItemComponent } from './user-list/user-list-item/user-list-item.component';
import { UserReportsComponent } from './user-reports/user-reports.component';
import { SettingsModule } from 'settings/settings.module';
import { FinancesSettingsComponent } from 'admin/finances/finances-settings.component';
import { EarningsSettingsComponent } from 'admin/finances/earnings-settings/earnings-settings.component';
import { GeneralSettingsComponent } from 'admin/general-settings/general-settings.component';
import { ParamSettingComponent } from 'admin/general-settings/param-setting/param-setting.component';
import { SuccessSnackbarComponent } from 'common/dialog/success-snackbar/success-snackbar.component';
import { ClickToADSPipe } from 'common/pipes/adshares-token.pipe';
import { RebrandingComponent } from 'admin/rebranding/rebranding.component';
import { PrivacyAndTermsSettingsComponent } from 'admin/privacy-and-terms-settings/privacy-and-terms-settings.component';
import { LicenseComponent } from 'admin/general-settings/license/license.component';
import { RejectedDomainsComponent } from 'admin/general-settings/rejected-domains/rejected-domains.component';
import { PanelBlockadeComponent } from 'admin/dashboard/panel-blockade/panel-blockade.component';
import { ImpersonationService } from '../impersonation/impersonation.service';
import { UsersComponent } from 'admin/users/users.component';
import { PublisherListComponent } from 'admin/publisher-list/publisher-list.component';
import { PublisherListItemComponent } from 'admin/publisher-list/publisher-list-item/publisher-list-item.component';
import { PanelPlaceholdersSettingsComponent } from 'admin/panel-placeholders-settings/panel-placeholders-settings.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    AppCommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSliderModule,
    SettingsModule,
    MatCheckboxModule,
    MatDividerModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTabsModule,
  ],
  providers: [
    AdminGuard,
    ClickToADSPipe,
    ImpersonationService,
  ],
  declarations: [
    AdminComponent,
    BidStrategyComponent,
    DashboardComponent,
    UsersComponent,
    UserListComponent,
    UserListItemComponent,
    PublisherListComponent,
    PublisherListItemComponent,
    UserReportsComponent,
    FinancesSettingsComponent,
    EarningsSettingsComponent,
    ParamSettingComponent,
    GeneralSettingsComponent,
    RebrandingComponent,
    PrivacyAndTermsSettingsComponent,
    LicenseComponent,
    RejectedDomainsComponent,
    PanelBlockadeComponent,
    PanelPlaceholdersSettingsComponent,
  ],
  entryComponents: [
    SuccessSnackbarComponent,
  ]
})
export class AdminModule {
}
