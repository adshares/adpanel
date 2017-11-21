import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';

import { WalletDialogComponent } from './dialogs/wallet-dialog/wallet-dialog.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WalletDialogComponent,
  ],
  entryComponents: [
    WalletDialogComponent
  ]
})
export class SettingsModule { }
