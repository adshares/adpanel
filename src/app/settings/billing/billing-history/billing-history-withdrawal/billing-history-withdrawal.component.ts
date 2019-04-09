import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  billingHistoryItemStatusEnum,
  billingHistoryItemTypeEnum
} from "models/enum/billing-history.enum";
import {
  faArchive,
  faHandHoldingUsd,
  faFileInvoiceDollar,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { appSettings } from 'app-settings';
import { SettingsService } from "settings/settings.service";
import { AppState } from "models/app-state.model";
import { Store } from "@ngrx/store";
import { CancelAwaitingTransaction } from "store/settings/settings.actions";

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
  icon;
  statusEnum = billingHistoryItemStatusEnum;

  constructor(private settingsService: SettingsService, private store: Store<AppState>) {

  }

  ngOnInit() {
    this.getIcon();

    this.billingHistoryItem.date = moment(this.billingHistoryItem.date).format('L hh:mm');
    if (this.billingHistoryItem.txid) {
      this.link = appSettings.ADS_OPERATOR_URL + '/blockexplorer/transactions/' + this.billingHistoryItem.txid;
    }
    this.status = billingHistoryItemStatusEnum[this.billingHistoryItem.status];
    this.formatType();
  }

  formatType(): void {
    const typeFromEnum = billingHistoryItemTypeEnum[this.billingHistoryItem.type].split("_");

    if (typeFromEnum.length === 1) {
      this.type = typeFromEnum[0].toLowerCase()
    } else {
      this.type = typeFromEnum[1].toLowerCase()
    }
  }

  getIcon(): void {
    switch (this.billingHistoryItem.type) {
      case 0:
        this.icon = faQuestion;
        break;
      case 1:
        this.icon = faArchive;
        break;
      case 2:
        this.icon = faHandHoldingUsd;
        break;
      case 3:
        this.icon = faFileInvoiceDollar;
        break;
      case 4:
        this.icon = faFileInvoiceDollar;
        break;
      default:
        this.icon = faQuestion;
    }
  }

  cancelAwaitingTransaction(id: number): void {
    this.store.dispatch(new CancelAwaitingTransaction(id));
  }
}
