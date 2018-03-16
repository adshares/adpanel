import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { TargetingOption } from 'models/targeting-option.model';
import { selectCompareForTargeting } from 'common/utilities/helpers';

@Component({
  selector: 'app-add-custom-targeting-dialog',
  templateUrl: './add-custom-targeting-dialog.component.html',
  styleUrls: ['./add-custom-targeting-dialog.component.scss']
})
export class AddCustomTargetingDialogComponent implements OnInit {
  selectedCategory: TargetingOption;
  selectCompareForTargeting = selectCompareForTargeting;

  constructor(
    public dialogRef: MatDialogRef<AddCustomTargetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.selectedCategory = this.data.parentOption;
    console.log('data', this.data);
  }
}
