import { NgModule } from '@angular/core';
import {Routes, RouterModule, Router} from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '', pathMatch: 'full', redirectTo: '/auth/register/confirm' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
