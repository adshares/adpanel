import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { AppState } from 'models/app-state.model';
import { ChartFilterSettings, FilterPreset, TimespanFilter } from 'models/chart/chart-filter-settings.model';
import * as moment from 'moment';
import { filterPresetsEnum } from 'models/enum/chart.enum';
import { enumToObjectArray } from 'common/utilities/helpers';
import { DATE_FORMAT } from 'common/utilities/consts';
import { faCalendar, faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-chart-filter',
  templateUrl: './chart-filter.component.html',
  styleUrls: ['./chart-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartFilterComponent extends HandleSubscriptionComponent implements OnInit {
  @Output() filter: EventEmitter<TimespanFilter> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('closed') closedStream: EventEmitter<boolean>;
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('opened') openedStream: EventEmitter<boolean>;
  @Input() small: boolean = false;

  dateFrom = new FormControl(moment(new Date()).subtract(1, 'months'));
  dateTo = new FormControl(moment(new Date()));
  today = new Date();
  currentDaysSpan: number;
  filterPresets: FilterPreset[] = enumToObjectArray(filterPresetsEnum);
  currentChartFilterSettings: ChartFilterSettings;
  currentFilterPreset: FilterPreset;
  currentFromFilter: string;
  currentToFilter: string;
  datepickerVisible: boolean = false;
  calendarOpened: boolean;
  faCalendar = faCalendar;
  faArrowAltCircleRight = faArrowAltCircleRight;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const chartFilterSubscription = this.store
      .select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
        this.updateCurrentDaysSpan();
      });
    this.subscriptions.push(chartFilterSubscription);
  }

  filterChart(from, to, isFromDatepicker) {
    this.hideDatepicker();
    const timespan = {
      from: isNaN(from) ? from.value._d : moment().startOf('day').subtract(from, 'days'),
      to: isNaN(to) ? moment(to.value._d).endOf('day') : moment().endOf('day'),
    };
    this.filter.emit(timespan);
    if (!isFromDatepicker) {
      this.dateFrom.setValue(moment().startOf('day').subtract(from, 'days'));
      this.dateTo.setValue(moment().startOf('day'));
    }
  }

  filterChartByDatepicker() {
    this.dateFrom.setValue(this.dateFrom.value);
    this.dateTo.setValue(moment(this.dateTo.value).endOf('day'));
    const datesSet = this.dateFrom.value && this.dateTo.value;
    const fromUnix = datesSet ? +this.dateFrom.value.startOf('day') <= +this.dateTo.value.startOf('day') : false;
    if (!fromUnix) {
      return;
    }
    this.filterChart(this.dateFrom, this.dateTo, true);
  }

  updateCurrentDaysSpan(): void {
    const momentFrom = moment(this.currentChartFilterSettings.currentFrom);
    const momentTo = moment(this.currentChartFilterSettings.currentTo);

    const isCurrent = moment(new Date()).format(DATE_FORMAT) === momentTo.format(DATE_FORMAT);
    this.currentDaysSpan = momentTo.diff(momentFrom, 'days');
    this.currentFilterPreset = this.filterPresets.find(p => p.id === this.currentDaysSpan && isCurrent);
    this.currentFromFilter = momentFrom.format(DATE_FORMAT);
    this.currentToFilter = momentTo.format(DATE_FORMAT);
    this.dateFrom.setValue(momentFrom);
    this.dateTo.setValue(momentTo);
  }

  showDatepicker() {
    this.datepickerVisible = true;
  }

  hideDatepicker() {
    if (!this.calendarOpened) {
      this.datepickerVisible = false;
    }
  }

  setCalendarStatus(status) {
    setTimeout(() => {
      this.calendarOpened = status;
    }, 500);
  }
}
