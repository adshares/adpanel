import { NgModule } from '@angular/core';

import { AppRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component'
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    AppRoutingModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent
  ]
})
export class AuthModule { }
