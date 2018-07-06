import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { RemindPasswordComponent } from './remind-password/remind-password.component';
import { RegisterConfirmComponent } from "auth/register-confirm/register-confirm.component";
import {ConfirmPasswordComponent} from "auth/confirm-password/confirm-password.component";
import {ConfirmationSendRecoveryPasswordComponent} from "auth/confirmation-send-recovery-password/confirmation-send-recovery-password.component";

const authRoutes: Routes = [
  { path: 'auth', component: AuthComponent, children: [
    { path: 'register-confirm/:token', component: RegisterConfirmComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'confirmation', component: ConfirmationComponent },
    { path: 'confirmation-password-send', component: ConfirmationSendRecoveryPasswordComponent },
    { path: 'remind-password', component: RemindPasswordComponent },
    { path: 'confirm-password/:token', component: ConfirmPasswordComponent },
  ]},
];

@NgModule({
  imports: [
    RouterModule.forRoot(authRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
