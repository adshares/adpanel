import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'app-chart-filter',
  templateUrl: './chart-filter.component.html',
  styleUrls: ['./chart-filter.component.scss'],
})
export class ChartFilterComponent {
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Output() filterByDatepicker: EventEmitter<any> = new EventEmitter();
  @Output() filterBySeries: EventEmitter<any> = new EventEmitter();
  @Output() filterByAsset: EventEmitter<any> = new EventEmitter();
  dateFrom = new FormControl();
  dateTo = new FormControl();

  filterChart(from, to) {
    const timespan = {
      from: isNaN(from) ? from.value._d : moment().subtract(from, 'days').format(),
      to: isNaN(to) ? to.value._d : moment().format()
    };

    this.filter.emit(timespan);
  }

  filterChartBySeries(series) {
    this.filterBySeries.emit(series);
  }

  filterChartByAsset(assetId) {
    this.filterByAsset.emit(assetId);
  }
}
