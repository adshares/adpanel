import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {
  COMMA,
  ENTER,
  SPACE
} from '@angular/cdk/keycodes';
import { TargetingOptionValue } from 'models/targeting-option.model';
import { MatChipInputEvent } from "@angular/material";

@Component({
  selector: 'app-targeting-custom-option-input',
  templateUrl: './targeting-custom-option-input.component.html',
  styleUrls: ['./targeting-custom-option-input.component.scss'],
  host: {'class': 'targeting-custom-option'},

})
export class TargetingCustomOptionInputComponent {
  @ViewChild('input') input: ElementRef;
  @Input() option;
  @Input() addedItems: TargetingOptionValue[];
  @Output()
  itemsChange: EventEmitter<TargetingOptionValue[]> = new EventEmitter<TargetingOptionValue[]>();
  readonly separatorKeysCodes: number[] = [COMMA, SPACE, ENTER];
  inputShown = false;
  customOptionsArray: TargetingOptionValue[] = [];

  constructor() {
  }

  showInput(): void {
    this.inputShown = true;
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 100)
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;

    if ((event.value || '').trim()) {
      const value = this.adjustValueBeforeSave(event.value);
      this.customOptionsArray.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  adjustValueBeforeSave(value: string): TargetingOptionValue {
    const trimmedValue = value.trim().split(' ').join('').toLowerCase();
    return {
      id: `${this.option.id}-${trimmedValue}`,
      label: trimmedValue,
      value: trimmedValue,
      parent: {
        valueType: 'string'
      },
      selected: true,
      allowInput: false,
      isCustom: true,
    };
  }

  remove(option: TargetingOptionValue): void {
    const index = this.customOptionsArray.indexOf(option);

    if (index >= 0) {
      this.customOptionsArray.splice(index, 1);
    }
  }

  saveCustomTargetingOptions(event?: KeyboardEvent): void {
    if (!event || event.keyCode === ENTER) {
      this.itemsChange.emit(this.customOptionsArray)
    }
  }
}
