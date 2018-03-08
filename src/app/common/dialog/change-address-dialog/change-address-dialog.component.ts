import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AppState } from '../../../models/app-state.model';
import { HandleSubscription } from '../../handle-subscription';
import { SettingsService } from '../../../settings/settings.service';

@Component({
  selector: 'app-change-address-dialog',
  templateUrl: './change-address-dialog.component.html',
  styleUrls: ['./change-address-dialog.component.scss']
})
export class ChangeAddressDialogComponent extends HandleSubscription implements OnInit {
  changeWithdrawAddressForm: FormGroup;

  userEthAddress: string;
  isFormBeingSubmitted = false;
  changeAddressFormSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<ChangeAddressDialogComponent>,
    private settingsService: SettingsService,
    private store: Store<AppState>
  ) {
    super(null);
  }

  ngOnInit() {
    this.createForm();

    const userEthAddressSubscription = this.store.select('state', 'user', 'data', 'userEthAddress')
      .subscribe((userEthAddress: string) => {
        this.userEthAddress = userEthAddress;
      });
    this.subscriptions.push(userEthAddressSubscription);
  }

  createForm() {
    this.changeWithdrawAddressForm = new FormGroup({
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(42),
        Validators.maxLength(42)
      ])
    });
  }

  changeWithdrawAddress() {
    this.changeAddressFormSubmitted = true;

    if (!this.changeWithdrawAddressForm.valid) {
      return;
    }

    this.isFormBeingSubmitted = true;

    const changeWithdrawAddressSubscription = this.settingsService
      .changeWithdrawAddress(this.changeWithdrawAddressForm.value.address)
      .subscribe(() => {
        this.dialogRef.close();
      });

    this.subscriptions.push(changeWithdrawAddressSubscription);

  }
}
