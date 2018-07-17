import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { AppState } from 'models/app-state.model';

@Component({
  selector: 'email-activation-resend-failed-confirm-dialog',
  templateUrl: './email-activation-resend-failed-confirm-dialog.component.html',
  styleUrls: ['./email-activation-resend-failed-confirm-dialog.component.scss'],
})
export class EmailActivationResendFailedConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EmailActivationResendFailedConfirmDialogComponent>,
    private dialog: MatDialog,
    private router: Router,
    private store: Store<AppState>
  ) { }
}
