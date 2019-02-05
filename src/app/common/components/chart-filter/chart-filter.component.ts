import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {HandleSubscription} from 'common/handle-subscription';
import {AppState} from 'models/app-state.model';
import {ChartFilterSettings, FilterPreset, TimespanFilter} from 'models/chart/chart-filter-settings.model';

import * as moment from 'moment';
import {filterPresetsEnum} from "models/enum/chart.enum";
import {enumToObjectArray} from "common/utilities/helpers";

@Component({
  selector: 'app-chart-filter',
  templateUrl: './chart-filter.component.html',
  styleUrls: ['./chart-filter.component.scss'],
})
export class ChartFilterComponent extends HandleSubscription implements OnInit, OnChanges {
  @Output() filter: EventEmitter<TimespanFilter> = new EventEmitter();
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

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
        this.updateCurrentDaysSpan();
      });

    this.subscriptions.push(chartFilterSubscription);
  }

  ngOnChanges() {
    this.updateCurrentDaysSpan();
  }

  filterChart(from, to, isFromDatepicker) {
    this.datepickerVisible = false;
    const timespan = {
      from: isNaN(from) ? from.value._d : moment().startOf('day').subtract(from, 'days'),
      to: isNaN(to) ? moment(to.value._d).endOf('day') : moment().endOf('day')
    };
    this.filter.emit(timespan);

    if (!isFromDatepicker) {
      this.dateFrom.setValue(moment().startOf('day').subtract(from, 'days'));
      this.dateTo.setValue(moment().startOf('day'));
    }
  }

  filterChartByDatepicker(from, to, fromDatepicker = true) {
    this.dateFrom.setValue(from.value);
    this.dateTo.setValue(moment(to).endOf('day'));

    const datesSet = from.value && to.value;
    const fromUnix = datesSet ? +from.value.startOf('day') <= +to.value.startOf('day') : false;

    if (!fromUnix) {
      return;
    }

    this.filterChart(from, to, fromDatepicker);
  }

  updateCurrentDaysSpan() {
    this.currentDaysSpan = moment(this.currentChartFilterSettings.currentTo)
      .diff(moment(this.currentChartFilterSettings.currentFrom), 'days');
    this.currentFilterPreset = this.filterPresets.find(p => p.id === this.currentDaysSpan);
    this.currentFromFilter = moment(this.currentChartFilterSettings.currentTo).format('L');
    this.currentToFilter = moment(this.currentChartFilterSettings.currentFrom).format('L');
  }

  showDatepicker() {
    this.datepickerVisible = true;
  }
}
