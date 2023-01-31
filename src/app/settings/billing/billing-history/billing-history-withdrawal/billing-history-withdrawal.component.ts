import { Component, Input, OnInit } from '@angular/core';
import { billingHistoryItemStatusEnum, billingHistoryItemTypeEnum } from 'models/enum/billing-history.enum';
import { faArchive, faHandHoldingUsd, faFileInvoiceDollar, faQuestion } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { appSettings } from 'app-settings';
import { SettingsService } from 'settings/settings.service';
import { AppState } from 'models/app-state.model';
import { BillingHistoryItem } from 'models/settings.model';
import { Store } from '@ngrx/store';
import { CancelAwaitingTransaction } from 'store/settings/settings.actions';
import { DATE_AND_TIME_FORMAT } from 'common/utilities/consts';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-billing-history-withdrawal',
  templateUrl: './billing-history-withdrawal.component.html',
  styleUrls: ['./billing-history-withdrawal.component.scss'],
})
export class BillingHistoryWithdrawalComponent implements OnInit {
  @Input() billingHistoryItem: BillingHistoryItem;
  billingHistoryItemDate: string = '';
  link: string;
  status: string;
  type: string;
  typeClass: string;
  icon;
  statusEnum = billingHistoryItemStatusEnum;
  faCalendar = faCalendar;

  constructor(private settingsService: SettingsService, private store: Store<AppState>) {}

  ngOnInit() {
    this.getIcon();

    this.billingHistoryItemDate = moment(this.billingHistoryItem.date).format(DATE_AND_TIME_FORMAT);
    if (/^[0-9A-F]{4}:[0-9A-F]{8}:[0-9A-F]{4}$/.test(this.billingHistoryItem.txid)) {
      this.link = appSettings.ADS_OPERATOR_URL + '/blockexplorer/transactions/' + this.billingHistoryItem.txid;
    }
    this.status = billingHistoryItemStatusEnum[this.billingHistoryItem.status];
    this.formatType();
  }

  formatType(): void {
    const typeFromEnum = billingHistoryItemTypeEnum[this.billingHistoryItem.type].split('_');
    if (typeFromEnum.length === 1) {
      this.type = typeFromEnum[0].toLowerCase();
    } else if (this.showBonusIcon) {
      this.type = typeFromEnum.join(' ').toLowerCase();
      this.typeClass = typeFromEnum[1].toLowerCase();
    } else {
      this.type = typeFromEnum[1].toLowerCase();
    }
  }

  get showBonusIcon(): boolean {
    return (
      this.billingHistoryItem.type === billingHistoryItemTypeEnum.BONUS_INCOME ||
      this.billingHistoryItem.type === billingHistoryItemTypeEnum.BONUS_EXPENDITURE
    );
  }

  getIcon(): void {
    switch (this.billingHistoryItem.type) {
      case billingHistoryItemTypeEnum.UNKNOWN:
        this.icon = faQuestion;
        break;
      case billingHistoryItemTypeEnum.REFUND:
      case billingHistoryItemTypeEnum.DEPOSIT:
        this.icon = faArchive;
        break;
      case billingHistoryItemTypeEnum.WITHDRAWAL:
        this.icon = faHandHoldingUsd;
        break;
      case billingHistoryItemTypeEnum.AD_INCOME:
      case billingHistoryItemTypeEnum.AD_EXPENDITURE:
      case billingHistoryItemTypeEnum.BONUS_INCOME:
      case billingHistoryItemTypeEnum.BONUS_EXPENDITURE:
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
