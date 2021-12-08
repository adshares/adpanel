import { NgModule } from '@angular/core'
import { ModeratorRoutingModule } from './moderator-routing.module'
import { ModeratorGuard } from './moderator-guard.service'
import { ModeratorComponent } from './moderator.component'
import { AppCommonModule } from 'common/common.module'
import { DashboardComponent } from 'moderator/dashboard/dashboard.component'

@NgModule({
  imports: [
    AppCommonModule,
    ModeratorRoutingModule,
  ],
  providers: [
    ModeratorGuard,
  ],
  declarations: [
    DashboardComponent,
    ModeratorComponent,
  ],
})
export class ModeratorModule {
}
