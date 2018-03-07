import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HandleSubscription } from '../../handle-subscription';
import { Store } from '@ngrx/store';
import { AppState } from '../../../models/app-state.model';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-add-funds-dialog',
  templateUrl: './add-funds-dialog.component.html',
  styleUrls: ['./add-funds-dialog.component.scss']
})
export class AddFundsDialogComponent extends HandleSubscription implements OnInit {
  adsharesEthAddress: string;

  constructor(
    public dialogRef: MatDialogRef<AddFundsDialogComponent>,
    private store: Store<AppState>,
    private commonService: CommonService
  ) {
    super(null);
  }

  ngOnInit() {
    const adsharesEthAddressSubscription = this.store.select('state', 'common', 'adsharesEthAddress')
      .subscribe((adsharesEthAddress: string) => {
        this.adsharesEthAddress = adsharesEthAddress;
      });
    this.subscriptions.push(adsharesEthAddressSubscription);
  }

}
