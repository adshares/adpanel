import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { TargetingOption, TargetingOptionType, TargetingOptionValue } from 'models/targeting-option.model';
import { prepareCustomOption } from 'common/components/targeting/targeting.helpers2';
import { DecentralandConverter } from 'common/utilities/targeting-converter/decentraland-converter';
import { CryptovoxelsConverter } from 'common/utilities/targeting-converter/cryptovoxels-converter';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-targeting-custom-option-input',
  templateUrl: './targeting-custom-option-input.component.html',
  styleUrls: ['./targeting-custom-option-input.component.scss'],
})
export class TargetingCustomOptionInputComponent {
  @ViewChild('input') input: ElementRef;
  @Input() option: TargetingOption;
  @Input() addedItems: TargetingOptionValue[];
  @Output()
  itemsChange: EventEmitter<TargetingOptionValue[]> = new EventEmitter<TargetingOptionValue[]>();
  readonly separatorKeysCodes: number[] = [COMMA, SPACE, ENTER];
  readonly TargetingOptionType = TargetingOptionType;
  inputShown = false;
  customOptionsArray: TargetingOptionValue[] = [];
  saveRequested = false;
  faPlus = faPlus;

  showInput(): void {
    if (this.inputShown) {
      return;
    }
    this.inputShown = true;
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 100);
  }

  add(event: MatChipInputEvent): void {
    const input = event.chipInput.inputElement;

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
    let url;
    if (CryptovoxelsConverter.ID === this.option.id) {
      url = this.prepareCryptovoxelsUrl(trimmedValue);
    } else if ('site/domain' === this.option.id) {
      url = `https://${trimmedValue}`;
    }
    const option = prepareCustomOption(trimmedValue, this.option.id, url);
    option.selected = true;
    return option;
  }

  remove(option: TargetingOptionValue): void {
    const index = this.customOptionsArray.indexOf(option);

    if (index >= 0) {
      this.customOptionsArray.splice(index, 1);
    }
  }

  saveCustomTargetingOptions(): void {
    this.itemsChange.emit(this.customOptionsArray);
  }

  saveCustomParcel(coordinateX: string, coordinateY: string): void {
    const value = `(${coordinateX}, ${coordinateY})`;
    const url = DecentralandConverter.ID === this.option.id ? this.prepareDecentralandUrl(value) : undefined;
    const option = prepareCustomOption(value, this.option.id, url);
    this.customOptionsArray.push(option);
    this.itemsChange.emit(this.customOptionsArray);
  }

  prepareCryptovoxelsUrl(value: string): string {
    const converter = new CryptovoxelsConverter();
    const backendUrl = `https://${converter.encodeValue(value)}`;
    return converter.convertBackendUrlToValidUrl(backendUrl);
  }

  prepareDecentralandUrl(value: string): string {
    const converter = new DecentralandConverter();
    const backendUrl = `https://${converter.encodeValue(value)}`;
    return converter.convertBackendUrlToValidUrl(backendUrl);
  }
}
