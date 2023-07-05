import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @Input() option: TargetingOption;
  @Input() addedItems: TargetingOptionValue[];
  @Output()
  itemsChange: EventEmitter<TargetingOptionValue[]> = new EventEmitter<TargetingOptionValue[]>();
  readonly TargetingOptionType = TargetingOptionType;
  customOptionsArray: TargetingOptionValue[] = [];
  saveRequested = false;
  faPlus = faPlus;

  private adjustValueBeforeSave(value: string): TargetingOptionValue {
    const trimmedValue = value.replace(/\s+/g, '').toLowerCase();
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

  saveCustomTargetingOption(): void {
    const value = (this.input.nativeElement.value || '').trim();
    if (value) {
      this.customOptionsArray.push(this.adjustValueBeforeSave(value));
    }
    this.input.nativeElement.value = '';

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
