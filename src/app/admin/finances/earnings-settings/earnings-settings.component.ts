import { Component, Input,  Output } from '@angular/core';
import { Subject } from "rxjs";

@Component({
  selector: 'app-earnings-settings',
  templateUrl: './earnings-settings.component.html',
  styleUrls: ['./earnings-settings.component.scss'],
  host: {'class': 'app-finances-settings'},
})
export class EarningsSettingsComponent  {
  @Input() title: string;
  @Input() desc: string;
  @Input() min: string;
  @Input() max: string;
  @Input() step: number;
  @Input() format: string;
  @Input() value: number;
  @Output() valueChanged = new Subject<number>();
  constructor() {}

  updateValue(newValue: number): void {
    const formattedValue = parseFloat(newValue.toFixed(2));
    this.valueChanged.next(formattedValue);
  }
}
