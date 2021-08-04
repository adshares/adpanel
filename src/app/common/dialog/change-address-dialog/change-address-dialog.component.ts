import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { SettingsService } from 'settings/settings.service';
import { LocalStorageUser, User } from 'models/user.model';
import { UpdateUserAddress } from 'store/auth/auth.actions';
import { appSettings } from 'app-settings';

@Component({
  selector: 'app-change-address-dialog',
  templateUrl: './change-address-dialog.component.html',
  styleUrls: ['./change-address-dialog.component.scss']
})
export class ChangeAddressDialogComponent extends HandleSubscription implements OnInit {
  isFormBeingSubmitted = false;
  changeAddressFormSubmitted = false;
  isConfirmed = false;
  adsharesAddress: string;
  changeWithdrawAddressForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ChangeAddressDialogComponent>,
    private settingsService: SettingsService,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    this.createForm();

    const userSubcrtiption = this.store.select('state', 'user', 'data',)
      .subscribe((user: User) => {
        this.adsharesAddress = '';
        this.isConfirmed = user.isConfirmed;
      });
    this.subscriptions.push(userSubcrtiption);
  }

  createForm() {
    this.changeWithdrawAddressForm = new FormGroup({
      address: new FormControl('', [
        Validators.required,
        Validators.pattern(appSettings.ADDRESS_REGEXP)
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
    const newLocalStorageUser: LocalStorageUser = Object.assign({}, userData, {adsharesAddress: address});

    localStorage.setItem('adshUser', JSON.stringify(newLocalStorageUser));
    this.store.dispatch(new UpdateUserAddress(address));
  }
}
