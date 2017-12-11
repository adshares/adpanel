import {Component, OnInit} from '@angular/core';
import { BillingHistoryItemModel } from '../../../models/billing-history-item.model';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss'],
})
export class BillingHistoryComponent implements OnInit {
  billingHistory: BillingHistoryItemModel[] = [
    {
      status: 349.80,
      date: '17 Jan 2018',
      address: '0x35-0xww9091j-x530',
      link: 'https://etherscan.io/address/0xde9190f9901',
    },
    {
      status: 349.80,
      date: '17 Jan 2018',
      address: '0x35-0xww9091j-x530',
      link: 'https://etherscan.io/address/0xde9190f9901',
    },
    {
      status: 349.80,
      date: '17 Jan 2018',
      address: '0x35-0xww9091j-x530',
      link: 'https://etherscan.io/address/0xde9190f9901',
    },
    {
      status: 349.80,
      date: '17 Jan 2018',
      address: '0x35-0xww9091j-x530',
      link: 'https://etherscan.io/address/0xde9190f9901',
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
