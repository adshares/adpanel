import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component'
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service'

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent
  ],
  providers: [
    CookieService,
    AuthService
  ]
})
export class AuthModule { }
