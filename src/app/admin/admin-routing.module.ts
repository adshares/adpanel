import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from './admin-guard.service';
import { AdminComponent } from './admin.component';
import { FinancesSettingsComponent } from "admin/finances/finances-settings.component";
import { GeneralSettingsComponent } from "admin/params/general-settings.component";

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: '/admin/dashboard'},
      {
        path: 'dashboard',
        component: DashboardComponent,

        children: [
          {
            path: '',
            component: GeneralSettingsComponent,
          },
          {
            path: 'general',
            component: GeneralSettingsComponent,
          },
          {
            path: 'finances',
            component: FinancesSettingsComponent,

          },
          {
            path: 'account',
            component: GeneralSettingsComponent,

          },
          {
            path: 'reports',
            component: GeneralSettingsComponent,

          },
        ]
      },


    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {
}
