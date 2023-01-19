import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BannerClassificationFilters } from 'models/classifier.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-classifier-filtering',
  templateUrl: './classifier-filtering.component.html',
  styleUrls: ['./classifier-filtering.component.scss'],
})
export class ClassifierFilteringComponent implements OnInit {
  @Input() sizeOptions: string[];
  @Output() filteringChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() siteId: number;
  @Input() classifierLocalBanners: number;
  status = new FormControl('Unclassified');
  landingUrl = new FormControl('');
  bannerId = new FormControl('');
  sizes: Array<string> = [];
  filtering: BannerClassificationFilters = {
    sizes: [],
  };
  isGlobal: boolean;
  classifierOption: string;

  allSizes: boolean;
  allSizesMatching: boolean;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.isGlobal = this.siteId === null;
    this.sizes = this.sizeOptions;
    this.classifierOption = this.route.snapshot.data.siteOptions.classifierLocalBanners;
    this.filtering = {
      ...this.filtering,
      sizes: this.sizeOptions,
    };
    this.checkBannerSizeOptions();
  }

  checkBannerSizeOptions() {
    this.allSizes = !this.filtering.sizes.length;
    this.allSizesMatching = this.filtering.sizes.length === this.sizeOptions.length;
  }

  sizeOptionChange(e, option) {
    if (e.checked && option === 'allSizes') {
      this.sizes = [];
      this.filtering = {
        ...this.filtering,
        sizes: this.sizes,
      };
      this.checkBannerSizeOptions();
      this.filteringChange.emit(this.filtering);
    }

    if (e.checked && option === 'allSizesMatching') {
      this.sizes = this.sizeOptions;
      this.filtering = {
        ...this.filtering,
        sizes: this.sizes,
      };
      this.checkBannerSizeOptions();
      this.filteringChange.emit(this.filtering);
    }

    if (!e.checked && option === 'allSizesMatching') {
      this.sizes = [];
      this.filtering = {
        ...this.filtering,
        sizes: this.sizes,
      };
      this.checkBannerSizeOptions();
      this.filteringChange.emit(this.filtering);
    }

    if (!e.checked && option === 'allSizes') {
      this.sizes = this.sizeOptions;
      this.filtering = {
        ...this.filtering,
        sizes: this.sizes,
      };
      this.checkBannerSizeOptions();
      this.filteringChange.emit(this.filtering);
    }
  }

  sizeSelect(e, size: string): void {
    if (e.checked) {
      this.sizes = [...this.sizes, size];
    } else {
      this.sizes = this.sizes.filter(s => s !== size);
    }
    this.filtering = {
      ...this.filtering,
      sizes: this.sizes,
    };
    this.checkBannerSizeOptions();
    this.filteringChange.emit(this.filtering);
  }

  changeFiltering(): void {
    if (!!this.status.value) {
      this.filtering = {
        ...this.filtering,
        status: {
          [this.status.value.toLowerCase()]: 1,
        },
      };
    } else {
      delete this.filtering.status;
    }
    this.filteringChange.emit(this.filtering);
  }

  changeFilteringByLandingUrl(): void {
    this.filtering = {
      ...this.filtering,
      landingUrl: this.landingUrl.value.trim(),
    };
    this.filteringChange.emit(this.filtering);
  }

  changeFilteringByBannerId(): void {
    this.filtering = {
      ...this.filtering,
      bannerId: this.bannerId.value.trim(),
    };
    this.filteringChange.emit(this.filtering);
  }

  changeFilteringByBannerIdReset(): void {
    this.bannerId.setValue('');

    delete this.filtering.bannerId;
    this.filteringChange.emit(this.filtering);
  }

  get statusDescription(): string {
    if (this.isGlobal && 'Approved' === this.status.value) {
      return 'Omitted';
    }
    if (!this.isGlobal && 'Rejected' === this.status.value) {
      return 'Omitted';
    }
    return this.status.value ? this.status.value : '';
  }

  changeFilterByServer(isChecked) {
    this.classifierLocalBanners = isChecked === true ? 1 : 0;
    this.filtering = {
      ...this.filtering,
      classifierLocalBanners: this.classifierLocalBanners,
    };
    this.filteringChange.emit(this.filtering);
  }
}
