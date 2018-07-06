import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppCommonModule } from 'common/common.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { RegisterComponent } from './register/register.component';
import { RemindPasswordComponent } from './remind-password/remind-password.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { RegisterConfirmComponent } from "auth/register-confirm/register-confirm.component";
import { ConfirmPasswordComponent } from "./confirm-password/confirm-password.component";
import { ConfirmationSendRecoveryPasswordComponent } from "auth/confirmation-send-recovery-password/confirmation-send-recovery-password.component";
import { ConfirmPasswordBadTokenComponent } from "./confirm-password-bad-token/confirm-password-bad-token.component";

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ],
  declarations: [
    RegisterConfirmComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    RemindPasswordComponent,
    ConfirmationComponent,
    ConfirmPasswordComponent,
    ConfirmationSendRecoveryPasswordComponent,
    ConfirmPasswordBadTokenComponent

  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
