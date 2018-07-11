import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';

import { AppState } from 'models/app-state.model';

@Component({
  selector: 'app-error-response-dialog-no-response',
  templateUrl: './error-response-dialog.component-no-response.html',
  styleUrls: ['./error-response-dialog.component-no-response.scss'],
})
export class ErrorResponseDialogComponentNoResponse {
  constructor(
    public dialogRef: MatDialogRef<ErrorResponseDialogComponentNoResponse>,
    private router: Router,
    private store: Store<AppState>
  ) { }
}
