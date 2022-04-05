import { Component, Input, Output } from '@angular/core';
import { Subject } from "rxjs";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  host: {'class': 'app-input'},
})
export class InputComponent {
  @Input() label: string;
  @Input() type: string;
  @Input() min?: string;
  @Input() max?: string;
  @Input() step?: number;
  @Input() format: string;
  @Input() helper: string;
  @Input() value: number | string;
  @Input() showSlider?: boolean;
  @Input() readonly?: boolean;
  @Input() transformDecimal: boolean;
  @Output() valueChanged = new Subject<any>();
  questionMarkIcon = faQuestionCircle;

  updateValue(newValue: any): void {
    this.valueChanged.next(newValue);
  }
}
