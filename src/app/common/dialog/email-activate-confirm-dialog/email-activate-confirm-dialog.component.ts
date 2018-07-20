import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';

import { AppState } from 'models/app-state.model';

@Component({
  selector: 'app-email-activate-confirm-dialog',
  templateUrl: './email-activate-confirm-dialog.component.html',
  styleUrls: ['./email-activate-confirm-dialog.component.scss'],
})
export class EmailActivateConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EmailActivateConfirmDialogComponent>,
    private router: Router,
    private store: Store<AppState>
  ) { }

}
