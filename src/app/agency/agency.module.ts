import { NgModule } from '@angular/core';
import { AgencyRoutingModule } from './agency-routing.module';
import { AgencyGuard } from './agency-guard.service';
import { AppCommonModule } from 'common/common.module';
import { DashboardComponent } from 'agency/dashboard/dashboard.component';

@NgModule({
  imports: [AppCommonModule, AgencyRoutingModule],
  providers: [AgencyGuard],
  declarations: [DashboardComponent],
})
export class AgencyModule {}
