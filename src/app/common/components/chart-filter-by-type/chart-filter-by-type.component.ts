import {Component, EventEmitter, Output} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { chartSeriesEnum } from '../../../models/enum/chart-series.enum';
import { enumToArray } from '../../utilities/helpers';

@Component({
  selector: 'app-chart-filter-by-type',
  templateUrl: './chart-filter-by-type.component.html',
  styleUrls: ['./chart-filter-by-type.component.scss'],
})
export class ChartFilterByTypeComponent {
  @Output() updateId: EventEmitter<any> = new EventEmitter();
  @Output() updateSeries: EventEmitter<any> = new EventEmitter();
  currentAssetId = 0;
  currentAssetSeries = 'clicks';

  chartSeries: string[] = enumToArray(chartSeriesEnum);

  updateAssetId(arg) {
    this.updateId.emit(arg);
  }

  updateAssetSeries(arg) {
    this.updateSeries.emit(arg);
  }
}
