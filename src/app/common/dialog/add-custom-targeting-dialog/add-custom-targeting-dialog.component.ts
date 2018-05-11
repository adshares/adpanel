import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TargetingOption } from 'models/targeting-option.model';
import { selectCompare } from 'common/utilities/helpers';
import { customTargetingActionsEnum } from 'models/enum/custom-targeting-actions.enum';
import { enumToArray } from 'common/utilities/helpers';
import { prepareCustomOption } from 'common/components/targeting/targeting.helpers';

@Component({
  selector: 'app-add-custom-targeting-dialog',
  templateUrl: './add-custom-targeting-dialog.component.html',
  styleUrls: ['./add-custom-targeting-dialog.component.scss']
})
export class AddCustomTargetingDialogComponent implements OnInit {
  customTargetingForm: FormGroup;
  selectedCategory: TargetingOption;
  selectCompare = selectCompare;

  customTargetingFormSubmitted = false;
  customTargetingActions = enumToArray(customTargetingActionsEnum);

  constructor(
    public dialogRef: MatDialogRef<AddCustomTargetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.selectedCategory = this.data.parentOption;
    this.createForm();
  }

  createForm() {
    this.customTargetingFormSubmitted = false;

    if (this.selectedCategory.value_type === 'number') {
      this.customTargetingForm = new FormGroup({
        customTargetingValue: new FormControl(null, [Validators.required, Validators.min(0)]),
        customTargetingAction: new FormControl(0, Validators.required)
      });

      return;
    }

    this.customTargetingForm = new FormGroup({
      customTargetingValue: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });
  }

  addCustomTareting() {
    const action = this.selectedCategory.value_type == 'number' ?
      this.customTargetingForm.get('customTargetingAction').value : null;

    this.customTargetingFormSubmitted = true;

    if (this.customTargetingForm.valid) {
      const customOption = prepareCustomOption(
        this.customTargetingForm.get('customTargetingValue').value,
        this.selectedCategory,
        this.data.targetingOptions,
        action,
      );

      this.dialogRef.close(customOption);
    }
  }
}
