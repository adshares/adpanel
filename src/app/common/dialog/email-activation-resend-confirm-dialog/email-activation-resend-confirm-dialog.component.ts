import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { AppState } from 'models/app-state.model';

@Component({
  selector: 'email-activation-resend-confirm-dialog',
  templateUrl: './email-activation-resend-confirm-dialog.component.html',
  styleUrls: ['./email-activation-resend-confirm-dialog.component.scss'],
})
export class EmailActivationResendConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EmailActivationResendConfirmDialogComponent>,
    private dialog: MatDialog,
    private router: Router,
    private store: Store<AppState>
  ) { }
}
