import { Component } from '@angular/core';
import { BillingHistoryItemModel } from '../../../models/billing-history-item.model';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss'],
})
export class BillingHistoryComponent {
  billingHistory: BillingHistoryItemModel[];
}
