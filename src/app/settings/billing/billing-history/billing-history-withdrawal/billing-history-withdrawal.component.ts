import {Component, Input, OnInit} from '@angular/core';
import {billingHistoryItemStatusEnum, billingHistoryItemTypeEnum} from "models/enum/billing-history.enum";
import * as moment from 'moment';

@Component({
  selector: 'app-billing-history-withdrawal',
  templateUrl: './billing-history-withdrawal.component.html',
  styleUrls: ['./billing-history-withdrawal.component.scss'],
})
export class BillingHistoryWithdrawalComponent implements OnInit {
  @Input() billingHistoryItem;
  status: string;
  type: string;

  ngOnInit() {
    this.billingHistoryItem.date = moment(this.billingHistoryItem.date).format('DD/MM/YYYY');
    this.status = billingHistoryItemStatusEnum[this.billingHistoryItem.status];
    this.type = billingHistoryItemTypeEnum[this.billingHistoryItem.type];
  }
}
