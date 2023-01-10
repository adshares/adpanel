import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss'],
})
export class DeleteUserDialogComponent {
  isDeletionConfirm: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {}

  confirmDeletion() {
    this.isDeletionConfirm = !this.isDeletionConfirm;
  }
}
