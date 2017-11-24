import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';

import { CustomizeAccountChooseDialogComponent } from './dialog/customize-account-choose-dialog/customize-account-choose-dialog.component';
import { AccountChooseDialogComponent } from './dialog/account-choose-dialog/account-choose-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  declarations: [
    CustomizeAccountChooseDialogComponent,
    AccountChooseDialogComponent
  ],
  entryComponents: [
    CustomizeAccountChooseDialogComponent,
    AccountChooseDialogComponent
  ],
})

export class AppCommonModule { }
