import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ban-user-dialog',
  templateUrl: './ban-user-dialog.component.html',
  styleUrls: ['./ban-user-dialog.component.scss'],
})
export class BanUserDialogComponent implements OnInit {
  form: FormGroup;
  readonly faQuestionCircle = faQuestionCircle;

  constructor(
    public dialogRef: MatDialogRef<BanUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      reason: new FormControl(null, [
        Validators.required,
        Validators.maxLength(255),
      ]),
    });
  }
}
