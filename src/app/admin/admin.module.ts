import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppCommonModule } from 'common/common.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminGuard } from './admin-guard.service';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserListItemComponent } from './users/user-list/user-list-item/user-list-item.component';
import { UserReportsComponent } from './user-reports/user-reports.component';
import { SettingsModule } from 'settings/settings.module';
import { GeneralSettingsComponent } from 'admin/general-settings/general-settings.component';
import { ClickToADSPipe } from 'common/pipes/adshares-token.pipe';
import { PanelBlockadeComponent } from 'admin/dashboard/panel-blockade/panel-blockade.component';
import { ImpersonationService } from '../impersonation/impersonation.service';
import { UsersComponent } from 'admin/users/users.component';
import { AdvertiserListComponent } from 'admin/users/advertiser-list/advertiser-list.component';
import { AdvertiserListItemComponent } from 'admin/users/advertiser-list/advertiser-list-item/advertiser-list-item.component';
import { PublisherListComponent } from 'admin/users/publisher-list/publisher-list.component';
import { PublisherListItemComponent } from 'admin/users/publisher-list/publisher-list-item/publisher-list-item.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
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
    MatRadioModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
  ],
  providers: [AdminGuard, ClickToADSPipe, ImpersonationService],
  declarations: [
    AdminComponent,
    DashboardComponent,
    UsersComponent,
    UserListComponent,
    UserListItemComponent,
    AdvertiserListComponent,
    AdvertiserListItemComponent,
    PublisherListComponent,
    PublisherListItemComponent,
    UserReportsComponent,
    GeneralSettingsComponent,
    PanelBlockadeComponent,
  ],
})
export class AdminModule {}
