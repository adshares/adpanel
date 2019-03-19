import { Component, Input,  Output } from '@angular/core';
import { Subject } from "rxjs";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  host: {'class': 'app-input'},
})
export class InputComponent  {
  @Input() label: string;
  @Input() desc: string;
  @Input() type: string;
  @Input() min?: string;
  @Input() max?: string;
  @Input() step?: number;
  @Input() format: string;
  @Input() value: number;
  @Input() showSlider?: boolean;
  @Input() transformDecimal: boolean;
  @Output() valueChanged = new Subject<any>();

  constructor() {}

  updateValue(newValue: any): void {
    this.valueChanged.next(newValue);
  }
}
