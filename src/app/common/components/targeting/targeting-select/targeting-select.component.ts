import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { TargetingOption, TargetingOptionValue } from '../../../../models/targeting-option.model';


@Component({
  selector: 'app-targeting-select',
  templateUrl: './targeting-select.component.html',
  styleUrls: ['./targeting-select.component.scss']
})
export class TargetingSelectComponent implements OnInit, OnChanges {
  @Input() targetingOptions;
  @Input() addedItems;
  @Output()
  itemsChange: EventEmitter<TargetingOptionValue[]> = new EventEmitter<TargetingOptionValue[]>();

  backAvailable = false;
  optionsHasValue = false;
  searchTerm = '';

  targetingOptionsForSearch: TargetingOption[] = [];
  viewModel: TargetingOption[];
  parentViewModel: TargetingOption[];
  parentOption: TargetingOption;
  selectedItems: TargetingOptionValue[] = [];

  ngOnInit() {
    this.prepareTargetingOptionsForSearch();
    this.viewModel = this.targetingOptions;
    this.selectedItems = [...this.addedItems];
  }

  ngOnChanges() {
    this.selectedItems = this.selectedItems.filter((item) => item.selected);
  }

  changeViewModel(options) {
    this.viewModel = options;

    this.backAvailable = !this.targetingOptions.some(
      (topOption) => topOption.key === options[0].key
    ) && this.searchTerm === '';

    if (this.backAvailable) {
      this.setBackViewModel(this.targetingOptions, options);
    }

    this.optionsHasValue = options[0].value ? true : false;
  }

  handleOptionClick(option) {
    this.searchTerm = '';

    if (option.values || option.children) {
      const newOptions = option.children ? option.children : option.values;

      this.changeViewModel(newOptions);
    } else if (option.value) {
      this.toggleItem(option);
    }
  }

  toggleItem(option) {
    const itemIndex = this.selectedItems.findIndex((item) => item.key === option.key);
    option.selected = !option.selected;

    if (option.selected && itemIndex < 0) {
      this.selectedItems.push(option);

      if (option.parent.value_type === 'boolean') {
        this.deselectOppositeBoolean(this.targetingOptions, option);
      }
    } else if (!option.secected && itemIndex >= 0) {
      this.selectedItems.splice(itemIndex, 1);
    }
  }

  deselectOppositeBoolean(options, searchOption) {
    options.forEach((option) => {
      if (option.values) {
        const oppositeBooleanOption = option.values.find(
          (optionValue) => optionValue.key !== searchOption.key
        )
        const itemIndex = this.selectedItems.findIndex(
          (item) => item.key === oppositeBooleanOption.key
        );

        if (oppositeBooleanOption && itemIndex > -1) {
          Object.assign(oppositeBooleanOption, { selected: false });
          this.selectedItems.splice(itemIndex, 1);
        }
      } else if (option.children) {
        this.deselectOppositeBoolean(option.children, searchOption);
      }
    });
  }

  handleItemsChange() {
    this.itemsChange.emit(this.selectedItems);
    this.onSearchTermChange();
  }

  setBackViewModel(options, currOptions) {
    const parentOption = options.find((option) => {
      const optionChildProp = option.children ? 'children' : 'values';

      return option[optionChildProp][0].key === currOptions[0].key;
    });

    if (parentOption) {
      this.parentViewModel = options;
      this.parentOption = parentOption;
    } else {
      options.forEach((option) => {
        if (option.children) {
          this.setBackViewModel(option.children, currOptions);
        }
      });
    }
  }

  prepareTargetingOptionsForSearch(options = this.targetingOptions, parentOption = undefined) {
    options.forEach((option) => {
      this.targetingOptionsForSearch.push(option);

      if (parentOption) {
        option.parentOptionLabel = parentOption.label;
      }

      if (option.children) {
        this.prepareTargetingOptionsForSearch(option.children, option);
      }
    });
  }

  onSearchTermChange() {
    const searchTerm = this.searchTerm.toLowerCase().trim();

    if (searchTerm) {
      this.prepareSearchViewModel();
    } else {
      this.changeViewModel(this.targetingOptions);
    }
  }

  prepareSearchViewModel() {
    const pattern = new RegExp(this.searchTerm, 'i');
    const searchModel = this.optionsHasValue ? this.viewModel : this.targetingOptionsForSearch;
    const searchViewModel = searchModel.filter((option) =>
      pattern.test(option.label.toLowerCase())
    );

    if (searchViewModel.length > 0) {
      this.changeViewModel(searchViewModel);
    } else {
      this.viewModel = [];
    }
  }

  findAndSelectItem(list, searchedItem) {
    list.forEach((item) => {
      const itemSublist = item.children || item.values;

      if (itemSublist) {
        this.findAndSelectItem(itemSublist, searchedItem);
        return;
      }

      if (item.key === searchedItem.key) {
        Object.assign(item, { selected: true });
      }
    });
  }
}
