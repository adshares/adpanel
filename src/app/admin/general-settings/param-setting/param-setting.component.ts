import {Component, Input, Output} from '@angular/core';
import {fadeAnimation} from "common/animations/fade.animation";
import {Subject} from "rxjs";

@Component({
  selector: 'app-param-setting',
  templateUrl: './param-setting.component.html',
  styleUrls: ['./param-setting.component.scss'],
  host: {'class': 'app-finances'},
  animations: [fadeAnimation]
})
export class ParamSettingComponent {
  @Input() title: string;
  @Input() desc: string;
  @Input() value: string;
  @Input() options: object = null;
  @Output() valueChanged: Subject<string> = new Subject();

  constructor() {
  }

  updateValue(value: string): void {
    this.valueChanged.next(value)
  }

  optionKeys(): string[] {
    return Object.keys(this.options || {});
  }
}
