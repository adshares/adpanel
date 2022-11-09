import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppCommonModule } from 'common/common.module'
import { AuthRoutingModule } from './auth-routing.module'
import { AuthComponent } from './auth.component'
import { LoginComponent } from './login/login.component'
import { OAuthLoginComponent } from 'auth/login/oauth-login.component'
import { RegisterComponent } from './register/register.component'
import { ForgottenPasswordComponent } from './forgotten-password/forgotten-password.component'
import { RegisteredComponent } from './registered/registered.component'
import { EmailProcessingComponent } from 'auth/account/email-processing.component'
import { ResetPasswordComponent } from 'auth/reset-password/reset-password.component'

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
  ],
  declarations: [
    EmailProcessingComponent,
    AuthComponent,
    LoginComponent,
    OAuthLoginComponent,
    RegisterComponent,
    RegisteredComponent,
    ForgottenPasswordComponent,
    ResetPasswordComponent,
  ],
})
export class AuthModule {
}
