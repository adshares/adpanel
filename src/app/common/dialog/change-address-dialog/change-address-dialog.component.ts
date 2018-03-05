import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HandleSubscription } from '../../handle-subscription';
import { SettingsService } from '../../../settings/settings.service';

@Component({
  selector: 'app-change-address-dialog',
  templateUrl: './change-address-dialog.component.html',
  styleUrls: ['./change-address-dialog.component.scss']
})
export class ChangeAddressDialogComponent extends HandleSubscription {
  changeWithdrawAddressForm: FormGroup = new FormGroup({
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(42),
      Validators.maxLength(42)
    ])
  });

  isFormBeingSubmitted = false;
  automaticWithdrawFormSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<ChangeAddressDialogComponent>,
    private settingsService: SettingsService
  ) {
    super(null);
  }

  changeWithdrawAddress() {
    this.automaticWithdrawFormSubmitted = true;

    if (!this.changeWithdrawAddressForm.valid) {
      return;
    }

    this.isFormBeingSubmitted = true;

    const changeWithdrawAddressSubscription = this.settingsService.changeWithdrawAddress(
      this.changeWithdrawAddressForm.value.address,
    )
      .subscribe(() => {
        this.dialogRef.close();
      });

    this.subscriptions.push(changeWithdrawAddressSubscription);

  }
}
