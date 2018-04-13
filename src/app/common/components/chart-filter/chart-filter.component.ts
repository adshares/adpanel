import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

import { TimespanFilter } from 'models/chart/chart-filter-settings.model';

@Component({
  selector: 'app-chart-filter',
  templateUrl: './chart-filter.component.html',
  styleUrls: ['./chart-filter.component.scss'],
})
export class ChartFilterComponent {
  @Output() filter: EventEmitter<TimespanFilter> = new EventEmitter();
  dateFrom = new FormControl('');
  dateTo = new FormControl('');
  today = new Date();

  filterChart(from, to) {
    const timespan = {
      from: isNaN(from) ? from.value._d : moment().subtract(from, 'days').format(),
      to: isNaN(to) ? to.value._d : moment().format()
    };

    this.filter.emit(timespan);
  }

  filterChartByDatepicker(from, to) {
    const dateSpanValid = this.dateTo.value >= this.dateFrom.value;

    if (!dateSpanValid) {
      return;
    }

    this.filterChart(from, to);
  }
}
