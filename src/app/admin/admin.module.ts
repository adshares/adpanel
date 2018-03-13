import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatIconModule, MatSliderModule } from '@angular/material';

import { AppCommonModule } from 'common/common.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminGuard } from './admin-guard.service';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserListItemComponent } from './user-list/user-list-item/user-list-item.component';
import { SetYourEarningsDialogComponent } from './dialogs/set-your-earnings-dialog/set-your-earnings-dialog.component';

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
    MatSliderModule
  ],
  providers: [
    AdminGuard
  ],
  declarations: [
    AdminComponent,
    DashboardComponent,
    UserListComponent,
    UserListItemComponent,
    SetYourEarningsDialogComponent
  ],
  entryComponents: [
    SetYourEarningsDialogComponent
  ]
})
export class AdminModule { }
