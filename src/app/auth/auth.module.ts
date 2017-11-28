import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { RegisterComponent } from './register/register.component';
import { RemindPasswordComponent } from './remind-password/remind-password.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { authReducers } from './store/auth.reducers';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    StoreModule.forRoot({auth: authReducers}),
    AuthRoutingModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    RemindPasswordComponent,
    ConfirmationComponent
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
