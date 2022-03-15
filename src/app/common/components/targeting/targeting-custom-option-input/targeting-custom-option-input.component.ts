import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes'
import { MatChipInputEvent } from '@angular/material'
import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model'
import { prepareCustomOption, TargetingOptionType } from 'common/components/targeting/targeting.helpers'

@Component({
  selector: 'app-targeting-custom-option-input',
  templateUrl: './targeting-custom-option-input.component.html',
  styleUrls: ['./targeting-custom-option-input.component.scss'],
})
export class TargetingCustomOptionInputComponent {
  @ViewChild('input') input: ElementRef;
  @Input() option: TargetingOption | TargetingOptionValue;
  @Input() addedItems: TargetingOptionValue[];
  @Output()
  itemsChange: EventEmitter<TargetingOptionValue[]> = new EventEmitter<TargetingOptionValue[]>();
  readonly separatorKeysCodes: number[] = [COMMA, SPACE, ENTER];
  readonly TargetingOptionType = TargetingOptionType;
  inputShown = false;
  customOptionsArray: TargetingOptionValue[] = [];
  saveRequested = false;

  showInput(): void {
    if (this.inputShown) {
      return;
    }
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

  private adjustValueBeforeSave(value: string): TargetingOptionValue {
    const trimmedValue = value.trim().split(' ').join('').toLowerCase();
    const option = prepareCustomOption(trimmedValue, this.option.id)
    option.selected = true
    return option
  }

  remove(option: TargetingOptionValue): void {
    const index = this.customOptionsArray.indexOf(option);

    if (index >= 0) {
      this.customOptionsArray.splice(index, 1);
    }
  }

  saveCustomTargetingOptions(): void {
    this.itemsChange.emit(this.customOptionsArray)
  }

  saveCustomParcel(coordinateX: string, coordinateY: string): void {
    const value = `(${coordinateX}, ${coordinateY})`
    const option = prepareCustomOption(value, this.option.id)
    this.customOptionsArray.push(option)
    this.itemsChange.emit(this.customOptionsArray)
  }
}
