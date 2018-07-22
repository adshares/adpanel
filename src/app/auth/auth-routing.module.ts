import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { RemindPasswordComponent } from './remind-password/remind-password.component';
import { EmailProcessingComponent } from "auth/email/email-processing.component";
import { ConfirmPasswordComponent } from "auth/confirm-password/confirm-password.component";
import { ConfirmationSendRecoveryPasswordComponent } from "auth/confirmation-send-recovery-password/confirmation-send-recovery-password.component";
import { ConfirmPasswordBadTokenComponent } from "auth/confirm-password-bad-token/confirm-password-bad-token.component";
import { ConfirmPasswordResetComponent } from "auth/confirm-password-reset/confirm-password-reset.component";

const authRoutes: Routes = [
  { path: 'auth', component: AuthComponent, children: [

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'confirmation', component: ConfirmationComponent },
    { path: 'confirmation-password-send', component: ConfirmationSendRecoveryPasswordComponent },
    { path: 'remind-password', component: RemindPasswordComponent },
    { path: 'confirm-password/:token', component: ConfirmPasswordComponent },
    { path: 'confirm-password-bad-token', component: ConfirmPasswordBadTokenComponent },
    { path: 'confirm-password-success', component: ConfirmPasswordResetComponent },

    { path: 'email-activation/:token', component: EmailProcessingComponent },
    { path: 'email-change-confirm-old/:token', component: EmailProcessingComponent },
    { path: 'email-change-confirm-new/:token', component: EmailProcessingComponent },
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
