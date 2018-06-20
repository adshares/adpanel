import { NgModule } from '@angular/core';
import {Routes, RouterModule, Router} from '@angular/router';
import {LoginComponent} from "auth/login/login.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/auth/register-confirm/:token', pathMatch: 'full' },
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
