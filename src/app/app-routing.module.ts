import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './auth/register/register.component';

const appRoutes: Routes = [
  { path: 'auth/register', component: RegisterComponent }
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
