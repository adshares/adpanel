import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisteredComponent } from './registered/registered.component';
import { ForgottenPasswordComponent } from './forgotten-password/forgotten-password.component';
import { EmailProcessingComponent } from 'auth/account/email-processing.component';
import { ResetPasswordComponent } from 'auth/reset-password/reset-password.component';

const authRoutes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register/:token', component: RegisterComponent },
      { path: 'registered', component: RegisteredComponent },
      { path: 'forgotten-password', component: ForgottenPasswordComponent },
      { path: 'reset-password/:token', component: ResetPasswordComponent },

      { path: 'email-activation/:token', component: EmailProcessingComponent },
      {
        path: 'email-change-confirm-old/:token',
        component: EmailProcessingComponent,
      },
      {
        path: 'email-change-confirm-new/:token',
        component: EmailProcessingComponent,
      },
      { path: 'password-confirm/:token', component: EmailProcessingComponent },
      {
        path: 'withdrawal-confirmation/:token',
        component: EmailProcessingComponent,
      },
      {
        path: 'connection-confirmation/:token',
        component: EmailProcessingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(authRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
