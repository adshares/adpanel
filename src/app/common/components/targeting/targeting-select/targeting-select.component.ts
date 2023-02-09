import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { findOption, findOptionList } from 'common/components/targeting/targeting.helpers';
import { cloneDeep } from 'common/utilities/helpers';
import { faQuestionCircle, faArrowLeft, faArrowRight, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-targeting-select',
  templateUrl: './targeting-select.component.html',
  styleUrls: ['./targeting-select.component.scss'],
})
export class TargetingSelectComponent implements OnInit, OnChanges {
  @ViewChild('searchInput') searchInput: ElementRef;
  @Input() targetingOptions: (TargetingOption | TargetingOptionValue)[];
  @Input() addedItems: TargetingOptionValue[];
  @Input() checkClass: string = 'checkmark';
  @Output()
  itemsChange: EventEmitter<TargetingOptionValue[]> = new EventEmitter<TargetingOptionValue[]>();
  selectedItems: TargetingOptionValue[] = [];
  viewModel: (TargetingOption | TargetingOptionValue)[] = [];
  parentViewModel: (TargetingOption | TargetingOptionValue)[];
  parentOption: TargetingOption | TargetingOptionValue;
  targetingOptionsForSearch: (TargetingOption | TargetingOptionValue)[] = [];
  itemsToRemove: TargetingOptionValue[] = [];
  faQuestionCircle = faQuestionCircle;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faSearch = faSearch;

  backAvailable = false;
  searchTerm = '';
  panelOpenState = false;

  ngOnInit(): void {
    this.selectedItems = this.addedItems;
    this.selectedItems.forEach(item => this.markParentOptions(item));
    this.prepareTargetingOptionsForSearch();
    this.viewModel = this.targetingOptions;
    this.selectSavedItemOnList();
  }

  ngOnChanges(): void {
    this.deselectRemovedOptions();
    if (this.selectedItems.length === this.addedItems.length) return;
    this.selectedItems = this.addedItems;
    this.selectSavedItemOnList();
  }

  changeViewModel(options: (TargetingOption | TargetingOptionValue)[]): void {
    const firstOption = options[0];
    this.searchInput.nativeElement.focus();
    this.viewModel = options;
    this.itemsToRemove = [];

    this.backAvailable =
      !this.targetingOptions.some(topOption => topOption.id === firstOption.id) && this.searchTerm === '';

    if (this.backAvailable) {
      this.setBackViewModel(firstOption);
    } else {
      this.parentOption = null;
    }
  }

  handleOptionClick(option: TargetingOption | TargetingOptionValue): void {
    this.searchTerm = '';
    const optionSublist = option['children'] || option['values'];
    if (optionSublist) {
      this.changeViewModel(optionSublist);
    }
  }

  toggleItem(option: TargetingOptionValue): void {
    const optionIndex = this.selectedItems.findIndex(item => item.id === option.id);

    option.selected = !option.selected;

    if (option.selected) {
      this.handleAddItem(option, optionIndex);
    } else {
      this.handleRemoveItem(option, optionIndex);
    }
  }

  handleAddItem(option: TargetingOptionValue, itemToAddIndex: number): void {
    if (itemToAddIndex === -1) {
      this.handleSiteCategoryUnknown(option);
      this.selectedItems.push(cloneDeep(option));
      this.addSubItems(option);
      this.markParentOptions(option);
      this.itemsChange.emit(this.selectedItems);
    }
  }

  toTargetingOption(option: TargetingOption | TargetingOptionValue): TargetingOption {
    return <TargetingOption>option;
  }

  private handleSiteCategoryUnknown(optionValue: TargetingOptionValue): void {
    if (optionValue.id.startsWith('site/category/')) {
      if ('site/category/unknown' === optionValue.id) {
        this.uncheckKnownSiteCategoryOptions();
      } else {
        const indexOfUnknown = this.selectedItems.findIndex(item => 'site/category/unknown' === item.id);
        if (-1 !== indexOfUnknown) {
          this.selectedItems.splice(indexOfUnknown, 1);
        }
      }
    }
  }

  private uncheckKnownSiteCategoryOptions(): void {
    const siteCategoryOption = findOption('site/category', this.targetingOptions);
    if (siteCategoryOption) {
      this.removeSubItems(siteCategoryOption);
    } else {
      this.targetingOptions.forEach(option => {
        if (option.id !== 'site/category/unknown') {
          this.removeItem(option as TargetingOptionValue);
        }
      });
    }
  }

  private removeItem(option: TargetingOptionValue): void {
    option.subSelected = false;
    const index = this.selectedItems.findIndex(item => item.id === option.id);
    if (-1 !== index) {
      this.selectedItems.splice(index, 1);
    }
    this.removeSubItems(option);
  }

  private addSubItems(option: TargetingOptionValue): void {
    if (option.values) {
      option.values.forEach(value => {
        const index = this.selectedItems.findIndex(item => item.id === value.id);
        if (-1 === index) {
          value.selected = true;
          this.selectedItems.push(cloneDeep(value));
          this.addSubItems(value);
        }
      });
    }
  }

  private markParentOptions(option: TargetingOptionValue): void {
    let currentOption = option;

    let hasValue: boolean;
    let parentOption;
    do {
      parentOption = findOption(currentOption.parentId, this.targetingOptions);
      if (!parentOption) {
        break;
      }
      hasValue = parentOption.hasOwnProperty('value');
      if (hasValue) {
        parentOption.subSelected = true;
      }
      currentOption = parentOption;
    } while (hasValue);
  }

  handleAddCustomItem(items, option): void {
    items = items
      .filter((item, index) => index === items.findIndex(el => el.id === item.id))
      .filter(item => !this.selectedItems.some(el => el.id === item.id));

    this.viewModel = this.viewModel.map(el => {
      return el.id === option.id
        ? {
            ...el,
            children: items,
          }
        : el;
    });

    this.selectedItems = [...this.selectedItems, ...items];

    this.itemsChange.emit(this.selectedItems);
  }

  handleRemoveItem(option: TargetingOptionValue, itemToRemoveIndex: number): void {
    option.subSelected = false;
    this.selectedItems.splice(itemToRemoveIndex, 1);
    this.removeSubItems(option);

    let hasValue: boolean;
    let parentOption;
    do {
      const parentOptionId = option.parentId;
      parentOption = findOption(parentOptionId, this.targetingOptions);
      if (!parentOption) {
        break;
      }
      hasValue = parentOption.hasOwnProperty('value');
      if (hasValue) {
        parentOption.subSelected = parentOption.values.some(item => item.selected || item.subSelected);

        if (parentOption.selected) {
          const index = this.selectedItems.findIndex(item => item.id === parentOptionId);
          if (-1 !== index) {
            this.selectedItems.splice(index, 1);
          }
        }
      }
      option = parentOption;
    } while (hasValue);

    this.itemsChange.emit(this.selectedItems);
  }

  private removeSubItems(option: TargetingOption | TargetingOptionValue): void {
    if (option.values) {
      option.values.forEach(value => this.removeItem(value));
    }
  }

  deselectRemovedOptions(options: (TargetingOption | TargetingOptionValue)[] = this.targetingOptions): void {
    options.forEach(option => {
      const sublist = option['children'] || option['values'];
      if (sublist) {
        this.deselectRemovedOptions(sublist);
      }
      if (!(<TargetingOptionValue>option).value) {
        return;
      }
      const itemInOptionsIndex = this.selectedItems.findIndex(addedItem => addedItem.id === option.id);
      this.selectedItems = this.addedItems;
      if (itemInOptionsIndex < 0) {
        Object.assign(option, { selected: false });
      }
    });
  }

  setBackViewModel(childOption: TargetingOption | TargetingOptionValue): void {
    const parentOptionId = childOption.parentId;

    this.parentViewModel = findOptionList(parentOptionId, this.targetingOptions);
    this.parentOption = this.parentViewModel.find(option => option.id === parentOptionId);
  }

  prepareTargetingOptionsForSearch(options?: (TargetingOption | TargetingOptionValue)[]): void {
    const allOptions = options || this.targetingOptions;

    allOptions.forEach(option => {
      this.targetingOptionsForSearch.push(option);
      if ((<TargetingOption>option).children) {
        this.prepareTargetingOptionsForSearch((<TargetingOption>option).children);
      }
      if (option.values) {
        this.prepareTargetingOptionsForSearch(option.values);
      }
    });
  }

  onSearchTermChange(): void {
    const searchTerm = this.searchTerm.toLowerCase().trim();
    if (searchTerm) {
      this.backAvailable = false;
      this.parentOption = null;
      this.prepareSearchViewModel();
      return;
    }

    this.changeViewModel(this.targetingOptions);
  }

  prepareSearchViewModel(): void {
    const pattern = new RegExp(this.searchTerm, 'i');
    const searchModel = this.targetingOptionsForSearch;
    const searchViewModel = searchModel.filter(option => pattern.test(option.label.toLowerCase()));

    if (searchViewModel.length > 0) {
      this.changeViewModel(searchViewModel);
    } else {
      this.viewModel = [];
    }
  }

  selectSavedItemOnList(): void {
    this.selectedItems.forEach(savedItem => {
      if (savedItem.isCustom) {
        return;
      }
      const item = findOption(savedItem.id, this.targetingOptions);
      if (item) {
        Object.assign(item, { selected: true });
      }
    });
  }
}
