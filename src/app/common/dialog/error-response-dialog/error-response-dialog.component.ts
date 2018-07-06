import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';

import { AppState } from 'models/app-state.model';

@Component({
  selector: 'app-error-response-dialog',
  templateUrl: './error-response-dialog.component.html',
  styleUrls: ['./error-response-dialog.component.scss'],
})
export class ErrorResponseDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorResponseDialogComponent>,
    private router: Router,
    private store: Store<AppState>
  ) { }
}
