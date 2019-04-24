import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { adSizesEnum } from 'models/enum/ad.enum';
import { enumToArray } from "common/utilities/helpers";
import { FormControl } from "@angular/forms";
import { BannerClassificationFilters } from "models/classifier.model";

@Component({
  selector: 'app-classifier-filtering',
  templateUrl: './classifier-filtering.component.html',
  styleUrls: ['./classifier-filtering.component.scss'],
})
export class ClassifierFilteringComponent implements OnInit {
  @Input() sizeOptions: string[];
  @Output() filteringChange: EventEmitter<any> = new EventEmitter<any>();
  status = new FormControl('Unclassified');
  sizes: Array<string> = [];
  adSizesOptions: string[] = [];
  filtering: BannerClassificationFilters = {};

  constructor() {
  }

  ngOnInit() {
    this.adSizesOptions = this.sizeOptions || enumToArray(adSizesEnum);
  }

  sizeSelect(e, size: string) {
    if (e.checked) {
      this.sizes = [
        ...this.sizes,
        size
      ]
    } else {
      this.sizes = this.sizes.filter(s => s !== size);
    }
    this.filtering = {
      ...this.filtering,
      sizes: this.sizes
    };
    this.filteringChange.emit(this.filtering);
  }


  changeFiltering() {
    if (!!this.status.value) {
      this.filtering = {
        ...this.filtering,
        status: {
          [this.status.value.toLowerCase()]: 1,
        }
      };
    } else {
      delete this.filtering.status
    }
    this.filteringChange.emit(this.filtering);
  }
}
