import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';

import { AppState } from 'models/app-state.model';

@Component({
  selector: 'app-register-confirm-dialog',
  templateUrl: './register-confirm-dialog.component.html',
  styleUrls: ['./register-confirm-dialog.component.scss'],
})
export class RegisterConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RegisterConfirmDialogComponent>,
    private router: Router,
    private store: Store<AppState>
  ) { }

}
