import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';

import { AppState } from 'models/app-state.model';

@Component({
  selector: 'app-email-activate-fail-dialog',
  templateUrl: './email-activate-fail-dialog.component.html',
  styleUrls: ['./email-activate-fail-dialog.component.scss'],
})
export class EmailActivateFailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EmailActivateFailDialogComponent>,
    private router: Router,
    private store: Store<AppState>
  ) { }

}
