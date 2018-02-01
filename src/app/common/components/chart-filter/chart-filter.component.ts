import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-chart-filter',
  templateUrl: './chart-filter.component.html',
  styleUrls: ['./chart-filter.component.scss'],
})
export class ChartFilterComponent {
  @Output() filter: EventEmitter<any> = new EventEmitter();
  // @Output() weekFilter: EventEmitter<any> = new EventEmitter();
  // @Output() monthFilter: EventEmitter<any> = new EventEmitter();

  filterChart(span) {
    console.log(span);
    this.filter.emit(span);
  }
}
