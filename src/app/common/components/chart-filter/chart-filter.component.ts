import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { ChartFilterSettings, FilterPreset, TimespanFilter } from 'models/chart/chart-filter-settings.model';

import * as moment from 'moment';
import { appSettings } from 'app-settings';

@Component({
  selector: 'app-chart-filter',
  templateUrl: './chart-filter.component.html',
  styleUrls: ['./chart-filter.component.scss'],
})
export class ChartFilterComponent extends HandleSubscription implements OnInit {
  @Output() filter: EventEmitter<TimespanFilter> = new EventEmitter();
  dateFrom = new FormControl(moment(new Date()).subtract(1, 'months'));
  dateTo = new FormControl(moment(new Date()));
  today = new Date();

  filterPresets: FilterPreset[] = appSettings.FILTER_PRESETS;
  currentChartFilterSettings: ChartFilterSettings;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });

    this.subscriptions.push(chartFilterSubscription);
  }

  filterChart(from, to, isFromDatepicker) {
    const timespan = {
      from: isNaN(from) ? from.value._d : moment().subtract(from, 'days'),
      to: isNaN(to) ? to.value._d : moment()
    };

    this.filter.emit(timespan);

    if (!isFromDatepicker) {
      this.dateFrom.setValue(moment().subtract(from, 'days'));
      this.dateTo.setValue(moment());
    }
  }

  filterChartByDatepicker(from, to, fromDatepicker = true) {
    this.dateFrom.setValue(from.value);
    this.dateTo.setValue(to.value);

    const datesSet = from.value && to.value;
    const fromUnix = datesSet ? +from.value.startOf('day') <= +to.value.startOf('day') : false;

    if (!fromUnix) {
      return;
    }

    this.filterChart(from, to, fromDatepicker);
  }
}
