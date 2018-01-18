import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-edit-process-dialog',
  templateUrl: './leave-edit-process-dialog.component.html',
  styleUrls: ['./leave-edit-process-dialog.component.scss']
})
export class LeaveEditProcessDialogComponent {
  constructor(public dialogRef: MatDialogRef<LeaveEditProcessDialogComponent>) { }
}
