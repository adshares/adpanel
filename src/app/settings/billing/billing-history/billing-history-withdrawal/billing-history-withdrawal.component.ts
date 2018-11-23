import {Component, Input, OnInit} from '@angular/core';
import {billingHistoryItemStatusEnum, billingHistoryItemTypeEnum} from "models/enum/billing-history.enum";
import * as moment from 'moment';
import { appSettings } from 'app-settings';

@Component({
  selector: 'app-billing-history-withdrawal',
  templateUrl: './billing-history-withdrawal.component.html',
  styleUrls: ['./billing-history-withdrawal.component.scss'],
})
export class BillingHistoryWithdrawalComponent implements OnInit {
  @Input() billingHistoryItem;
  link: string;
  status: string;
  type: string;

  ngOnInit() {
    this.billingHistoryItem.date = moment(this.billingHistoryItem.date).format('DD/MM/YYYY');
    if (this.billingHistoryItem.txid) {
      this.link = appSettings.ADS_OPERATOR_URL + '/blockexplorer/transactions/' + this.billingHistoryItem.txid;
    }
    this.status = billingHistoryItemStatusEnum[this.billingHistoryItem.status];
    this.type = billingHistoryItemTypeEnum[this.billingHistoryItem.type];
  }
}
