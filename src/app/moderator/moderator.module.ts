import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModeratorRoutingModule } from './moderator-routing.module';
import { ModeratorGuard } from './moderator-guard.service';
import { AppCommonModule } from 'common/common.module';
import { DashboardComponent } from 'moderator/dashboard/dashboard.component';

@NgModule({
  imports: [AppCommonModule, ModeratorRoutingModule, FontAwesomeModule],
  providers: [ModeratorGuard],
  declarations: [DashboardComponent],
})
export class ModeratorModule {}
