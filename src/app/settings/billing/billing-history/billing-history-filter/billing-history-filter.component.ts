import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { AppState } from 'models/app-state.model';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import * as moment from 'moment';
import { enumToObjectArray } from 'common/utilities/helpers';
import { BillingHistoryFilter } from 'models/settings.model';
import { billingHistoryItemTypeEnum } from 'models/enum/billing-history.enum';
import { faCaretDown, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-billing-history-filter',
  templateUrl: './billing-history-filter.component.html',
  styleUrls: ['./billing-history-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingHistoryFilterComponent extends HandleSubscriptionComponent implements OnInit {
  @Output() filter: EventEmitter<BillingHistoryFilter> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('closed') closedStream: EventEmitter<boolean>;
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('opened') openedStream: EventEmitter<boolean>;

  dateFrom = new FormControl(moment().subtract(30, 'days').startOf('day'));
  dateTo = new FormControl(moment().endOf('day'));
  today: Date = new Date();

  currentChartFilterSettings: ChartFilterSettings;
  filterSelectorVisible: boolean = false;
  calendarOpened: boolean = false;

  filterIcon = faCaretDown;
  faCalendar = faCalendar;
  faArrowCircleRight = faArrowCircleRight;
  transactionTypes: any[] = [];
  isCheckedAll: boolean = true;

  constructor(private store: Store<AppState>) {
    super();

    this.transactionTypes = BillingHistoryFilterComponent.prepareTransactionTypes();
  }

  private static prepareTransactionTypes(): any[] {
    let types = enumToObjectArray(billingHistoryItemTypeEnum);
    types.shift(); // remove UNKNOWN type

    types = types.map(function (item) {
      item.name = item.name.charAt(0).toUpperCase() + item.name.slice(1).replace('_', ' ');
      item.checked = false;

      return item;
    });

    return types;
  }

  ngOnInit() {
    const chartFilterSubscription = this.store
      .select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });
    this.subscriptions.push(chartFilterSubscription);
  }

  filterBillingHistory() {
    this.hideDatepicker();

    const filter: BillingHistoryFilter = {
      from: this.dateFrom.value.startOf('day'),
      to: this.dateTo.value.endOf('day'),
      types: this.getCheckedTypes(),
    };

    this.filter.emit(filter);
  }

  getCheckedTypes(): number[] {
    if (this.isCheckedAll) {
      return [];
    }

    let checkedTypes = [];
    this.transactionTypes.forEach(element => {
      if (element.checked) {
        checkedTypes.push(element.id);
      }
    });

    return checkedTypes;
  }

  onCheckboxChange($event, id: number): void {
    this.transactionTypes.find(element => element.id === id).checked = $event.checked;
    this.isCheckedAll = false;
  }

  onCheckboxAllChange($event): void {
    this.isCheckedAll = $event.checked;
    this.transactionTypes.forEach(element => (element.checked = this.isCheckedAll));
  }

  showDatepicker() {
    this.filterSelectorVisible = true;
  }

  hideDatepicker() {
    if (!this.calendarOpened) {
      this.filterSelectorVisible = false;
    }
  }

  setCalendarStatus(status) {
    setTimeout(() => {
      this.calendarOpened = status;
    }, 500);
  }
}
