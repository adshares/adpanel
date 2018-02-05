import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-chart-filter-by-type',
  templateUrl: './chart-filter-by-type.component.html',
  styleUrls: ['./chart-filter-by-type.component.scss'],
})
export class ChartFilterByTypeComponent {
  @Output() filter: EventEmitter<any> = new EventEmitter();

  filterChart(span) {
    this.filter.emit(span);
  }
}
