import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomizeAccountChooseDialogComponent } from './dialog/customize-account-choose-dialog/customize-account-choose-dialog.component';
import { CustomizeAdvertiserDialogComponent } from './dialog/customize-advertiser-dialog/customize-advertiser-dialog.component'

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [

  ],
  declarations: [
    CustomizeAccountChooseDialogComponent,
    CustomizeAdvertiserDialogComponent
  ],
  exports: []
})
export class AppCommonModule { }
