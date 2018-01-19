import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from './admin-guard.service';
import { AdminComponent } from './admin.component';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    // canActivate: [AdminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/admin/dashboard' },
      { path: 'dashboard', component: DashboardComponent }
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
export class AdminRoutingModule { }
