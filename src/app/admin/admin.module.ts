import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '../common/common.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminGuard } from './admin-guard.service';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserListItemComponent } from './user-list/user-list-item/user-list-item.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    AppCommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AdminGuard,
  ],
  declarations: [
    AdminComponent,
    DashboardComponent,
    UserListComponent,
    UserListItemComponent
  ]
})
export class AdvertiserModule { }
