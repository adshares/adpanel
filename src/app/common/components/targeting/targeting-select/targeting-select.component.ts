import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { AddCustomTargetingDialogComponent } from 'common/dialog/add-custom-targeting-dialog/add-custom-targeting-dialog.component';
import { HandleSubscription } from 'common/handle-subscription';

@Component({
  selector: 'app-targeting-select',
  templateUrl: './targeting-select.component.html',
  styleUrls: ['./targeting-select.component.scss']
})
export class TargetingSelectComponent extends HandleSubscription implements OnInit, OnChanges {
  @Input() targetingOptions;
  @Input() addedItems;
  @Output()
  itemsChange: EventEmitter<TargetingOptionValue[]> = new EventEmitter<TargetingOptionValue[]>();

  targetingOptionsForSearch: TargetingOption[] = [];
  viewModel: TargetingOption[];
  parentViewModel: TargetingOption[];
  parentOption: TargetingOption;
  selectedItems: TargetingOptionValue[] = [];

  backAvailable = false;
  optionsHasValue = false;
  searchTerm = '';

  constructor(private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.prepareTargetingOptionsForSearch();
    this.viewModel = this.targetingOptions;
    this.selectedItems = [...this.addedItems];
  }

  ngOnChanges() {
    this.selectedItems = this.selectedItems.filter((item) => item.selected || item.isCustom);
  }

  changeViewModel(options) {
    this.viewModel = options;

    this.backAvailable = !this.targetingOptions.some(
      (topOption) => topOption.key === options[0].key
    ) && this.searchTerm === '';

    if (this.backAvailable) {
      this.setBackViewModel(this.targetingOptions, options);
    }

    this.optionsHasValue = options[0].hasOwnProperty('value') ? true : false;
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
        if (option.values.find((optionValue) => optionValue.key === searchOption.key)) {
          const oppositeBooleanOption = option.values.find(
            (optionValue) => optionValue.key !== searchOption.key
          );
          const itemIndex = this.selectedItems.findIndex(
            (item) => item.key === oppositeBooleanOption.key
          );

          if (oppositeBooleanOption.selected) {
            Object.assign(oppositeBooleanOption, { selected: false });
            this.selectedItems.splice(itemIndex, 1);
          }
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
      this.backAvailable = false;
      this.parentOption = null;
      this.prepareSearchViewModel();

      return;
    }

    this.changeViewModel(this.targetingOptions);
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

  loadItems(
    savedList: TargetingOptionValue[],
    searchList: TargetingOptionValue[] | TargetingOption[],
    choosedList: TargetingOptionValue[]
  ) {
    savedList.forEach((savedItem) => {
      const item = this.findItem(searchList, savedItem.key);

      if (item) {
        Object.assign(item, { selected: true });
        choosedList.push(item);
      } else if (savedItem.isCustom) {
        choosedList.push(savedItem);
      }
    })
  }

  findItem(list: Partial<TargetingOptionValue[]> | TargetingOption[], itemKey: string) {
    for (let i = 0; i < list.length; i++) {
      const itemSublist = list[i].children || list[i].values;

      if (itemSublist) {
        const result = this.findItem(itemSublist, itemKey);

        if (result) {
          return result;
        }
      }

      if (list[i].key === itemKey) {
        return list[i];
      }
    }

    return false;
  }

  addCustomOption() {
    const availableOptions = this.targetingOptionsForSearch.filter(option => option.allow_input)

    const addCustomOptionDialog = this.dialog.open(
      AddCustomTargetingDialogComponent,
      {
        data: {
          parentOption: this.parentOption,
          targetingOptions: this.targetingOptions,
          availableOptions,
        }
      }
    );

    const customDialogCloseSubscription = addCustomOptionDialog.afterClosed()
      .subscribe((customOption) => {
        if (customOption) {
          this.selectedItems.push(customOption);
          this.itemsChange.emit(this.selectedItems);
          this.onSearchTermChange();
          this.parentOption = null;
        }
      });
    this.subscriptions.push(customDialogCloseSubscription);
  }
}
