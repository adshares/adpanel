import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { SettingsService } from 'settings/settings.service';
import { LocalStorageUser } from 'models/user.model';

import * as authActions from 'store/auth/auth.actions';

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

    const address = this.changeWithdrawAddressForm.value.address;

    const changeWithdrawAddressSubscription = this.settingsService
      .changeWithdrawAddress(address)
      .subscribe(() => this.dialogRef.close());

    this.subscriptions.push(changeWithdrawAddressSubscription);

    const userData = JSON.parse(localStorage.getItem('adshUser'));
    const newLocalStorageUser: LocalStorageUser = Object.assign({}, userData, { userEthAddress: address });

    localStorage.setItem('adshUser', JSON.stringify(newLocalStorageUser));
    this.store.dispatch(new authActions.UpdateUserEthAddress(address));
  }
}
