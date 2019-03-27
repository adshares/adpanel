import { Component, Input,  Output } from '@angular/core';
import { fadeAnimation } from "common/animations/fade.animation";
import { Subject } from "rxjs";

@Component({
  selector: 'app-earnings-settings',
  templateUrl: './earnings-settings.component.html',
  styleUrls: ['./earnings-settings.component.scss'],
  host: {'class': 'app-finances-settings'},
  animations: [fadeAnimation]
})
export class EarningsSettingsComponent  {
  @Input() title: string;
  @Input() desc: string;
  @Input() min: string;
  @Input() max: string;
  @Input() step: number;
  @Input() format: string;
  @Input() value: number;
  @Input() showSlider: boolean;
  @Input() transformDecimal: boolean;
  @Output() valueChanged = new Subject<number>();

  constructor() {}

  updateValue(newValue: number): void {
    this.valueChanged.next(newValue);
  }
}
