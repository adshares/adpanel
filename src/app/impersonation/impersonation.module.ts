import { NgModule } from '@angular/core';
import { ImpersonationComponent } from './impersonation/impersonation.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [CommonModule, BrowserModule, MatIconModule, FontAwesomeModule],
  exports: [ImpersonationComponent],
  declarations: [ImpersonationComponent],
})
export class ImpersonationModule {}
