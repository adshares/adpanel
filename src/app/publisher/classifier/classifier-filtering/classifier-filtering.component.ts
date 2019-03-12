import { Component, EventEmitter, Output } from '@angular/core';
import { adSizesEnum } from 'models/enum/ad.enum';
import { enumToArray } from "common/utilities/helpers";
import { FormControl } from "@angular/forms";
import { BannerClassificationFilters } from "models/classifier.model";

@Component({
  selector: 'app-classifier-filtering',
  templateUrl: './classifier-filtering.component.html',
  styleUrls: ['./classifier-filtering.component.scss'],
})
export class ClassifierFilteringComponent {
  @Output() filteringChange: EventEmitter<any> = new EventEmitter<any>();
  status = new FormControl('');
  size: Array<string> = [];
  adSizesOptions = enumToArray(adSizesEnum);
  filtering: BannerClassificationFilters = {};

  constructor() {
  }

  sizeSelect(e, size: string) {
    if (e.checked) {
      this.size = [
        ...this.size,
        size
      ]
    } else {
      this.size = this.size.filter(s => s !== size);
    }
  }


  changeFiltering() {
    this.filtering = {
      ...this.filtering,
      status: {
        [this.status.value.toLowerCase()]: 1,
      }
    };

    this.filteringChange.emit(this.filtering);
  }
}
