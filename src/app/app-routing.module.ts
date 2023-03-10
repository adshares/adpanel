import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceUnavailableComponent } from 'common/info/service-unavailable/service-unavailable.component';

const appRoutes: Routes = [
  { path: '503', component: ServiceUnavailableComponent, pathMatch: 'full' },
  { path: 'preview', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'ref/:token',
    redirectTo: '/auth/register/:token',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
