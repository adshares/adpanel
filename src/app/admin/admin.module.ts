import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatInputModule,
  MatSliderModule,
  MatCheckboxModule
} from '@angular/material';

import { AppCommonModule } from 'common/common.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminGuard } from './admin-guard.service';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserListItemComponent } from './user-list/user-list-item/user-list-item.component';
import { SettingsModule } from "settings/settings.module";
import { FinancesSettingsComponent } from "admin/finances/finances-settings.component";
import { EarningsSettingsComponent } from "admin/finances/earnings-settings/earnings-settings.component";
import { GeneralSettingsComponent } from "admin/general-settings/general-settings.component";
import { ParamSettingComponent } from "admin/general-settings/param-setting/param-setting.component";

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
    MatCheckboxModule
  ],
  providers: [
    AdminGuard
  ],
  declarations: [
    AdminComponent,
    DashboardComponent,
    UserListComponent,
    UserListItemComponent,
    FinancesSettingsComponent,
    EarningsSettingsComponent,
    ParamSettingComponent,
    GeneralSettingsComponent
  ],
})
export class AdminModule {
}
