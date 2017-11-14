import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';

const appRoutes: Routes = [
  { path: 'auth', component: AuthComponent, children: [
    { path: 'login', component: LoginComponent },
  ]},
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
