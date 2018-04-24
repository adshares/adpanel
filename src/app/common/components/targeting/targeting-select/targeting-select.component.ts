import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { AddCustomTargetingDialogComponent } from 'common/dialog/add-custom-targeting-dialog/add-custom-targeting-dialog.component';
import { HandleSubscription } from 'common/handle-subscription';
import { findOptionList, findOption, getParentId, getLabelPath } from 'common/components/targeting/targeting.helpers';
import { cloneDeep } from 'common/utilities/helpers';

@Component({
  selector: 'app-targeting-select',
  templateUrl: './targeting-select.component.html',
  styleUrls: ['./targeting-select.component.scss']
})
export class TargetingSelectComponent extends HandleSubscription implements OnInit {
  @Input() targetingOptions;
  @Input() addedItems;
  @Output()
  itemsChange: EventEmitter<TargetingOptionValue[]> = new EventEmitter<TargetingOptionValue[]>();

  viewModel: (TargetingOption | TargetingOptionValue)[];
  parentViewModel: (TargetingOption | TargetingOptionValue)[];
  parentOption: TargetingOption | TargetingOptionValue;
  targetingOptionsForSearch: TargetingOption[] = [];
  selectedItems: TargetingOptionValue[] = [];
  itemsToRemove: TargetingOptionValue[] = [];

  backAvailable = false;
  optionsHasValue = false;
  searchTerm = '';

  constructor(private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.prepareTargetingOptionsForSearch();
    this.viewModel = this.targetingOptions;
    this.selectSavedItemOnList();
  }

  ngOnChanges() {
    this.deselectRemovedOptions();
  }

  changeViewModel(options: (TargetingOption | TargetingOptionValue)[]) {
    const firstOption = options[0];

    this.viewModel = options;
    this.selectedItems = [];
    this.itemsToRemove = [];

    this.backAvailable = !this.targetingOptions.some(
      (topOption) => topOption.id === firstOption.id
    ) && this.searchTerm === '';

    if (this.backAvailable) {
      this.setBackViewModel(firstOption);
    } else {
      this.parentOption = null
    }

    this.optionsHasValue = firstOption.hasOwnProperty('value');
  }

  handleOptionClick(option: TargetingOption | TargetingOptionValue) {
    const optionSublist = option['children'] || option['values'];

    this.searchTerm = '';

    if (optionSublist) {
      this.changeViewModel(optionSublist);
    }
  }

  toggleItem(option: TargetingOptionValue) {
    const itemToAddIndex = this.selectedItems.findIndex((item) => item.id === option.id);
    const itemToRemoveIndex = this.itemsToRemove.findIndex((item) => item.id === option.id);

    option.selected = !option.selected;

    if (option.selected) {
      if ( itemToAddIndex < 0) {
        this.selectedItems.push(cloneDeep(option));
      }

      if (option.parent.value_type === 'boolean') {
        this.deselectOppositeBoolean(option);
      }

      if (itemToRemoveIndex > -1) {
        this.itemsToRemove.splice(itemToRemoveIndex, 1);
      }

      return;
    }

    if (itemToAddIndex > -1) {
      this.selectedItems.splice(itemToAddIndex, 1);
    }

    if (itemToRemoveIndex < 0) {
      this.itemsToRemove.push(cloneDeep(option));
    }
  }

  deselectOppositeBoolean(option: TargetingOptionValue) {
    const optionList = findOptionList(option.id, this.targetingOptions);
    const opositeOption = optionList.find((opositeOption) => opositeOption.id !== option.id);

    if (opositeOption && opositeOption['selected']) {
      const opositeOptionIndex = this.selectedItems.findIndex(
        (option) => option.id === opositeOption.id
      );

      Object.assign(opositeOption, { selected: false });
      this.selectedItems.splice(opositeOptionIndex, 1);
    }
  }

  deselectRemovedOptions(options: (TargetingOption | TargetingOptionValue)[] = this.targetingOptions) {
    options.forEach((option) => {
      const sublist = option['children'] || option['values'];

      if (sublist) {
        this.deselectRemovedOptions(sublist);
        return;
      }

      const itemInOptionsIndex = this.addedItems.findIndex((addedItem) => addedItem.id === option.id);

      if (itemInOptionsIndex < 0) {
        Object.assign(option, { selected: false });
      }
    });
  }

  handleItemsChange() {
    this.selectedItems.forEach((item) => {
      if (!this.addedItems.find((addedItem) => addedItem.id === item.id)) {
        this.addedItems = [...this.addedItems, item];
      }
    });
    this.itemsToRemove.forEach((item) => {
      const itemToRemoveIndex = this.addedItems.findIndex((addedItem) => addedItem.id === item.id);

      if (itemToRemoveIndex > -1) {
        this.addedItems.splice(itemToRemoveIndex, 1);
      }
    });
    this.itemsChange.emit(this.addedItems);
    this.setInitialState();
  }

  setInitialState() {
    this.changeViewModel(this.targetingOptions);
    this.selectedItems = [];
    this.itemsToRemove = [];
    this.parentOption = null;
    this.backAvailable = false;
  }

  setBackViewModel(option: TargetingOption | TargetingOptionValue) {
    const parentOptionId = getParentId(option.id);

    this.parentViewModel = findOptionList(parentOptionId, this.targetingOptions);
    this.parentOption = this.parentViewModel.find((option) => option.id === parentOptionId);
  }

  prepareTargetingOptionsForSearch(options: TargetingOption[] = this.targetingOptions) {
    // prepare list only for options that are not on bottom level as search
    // is done through visible items then
    options.forEach((option) => {
       //not genering path for top level options
      if (option.id.split('-').length > 1) {
        const path = getLabelPath(option.id, this.targetingOptions);

        Object.assign(option, { path });
      }

      this.targetingOptionsForSearch.push(option);

      if (option.children) {
        this.prepareTargetingOptionsForSearch(option.children);
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
    // bottom level options are searched only from visible ones
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

  selectSavedItemOnList() {
    this.addedItems.forEach((savedItem) => {
      if (savedItem.isCustom) {
        return;
      }

      const item = findOption(savedItem.id, this.targetingOptions);

      if (item) {
        Object.assign(item, { selected: true });
      }
    });
  }

  addCustomOption() {
    const availableOptions = this.targetingOptionsForSearch.filter(option => option.allow_input)

    const addCustomOptionDialog = this.dialog.open(
      AddCustomTargetingDialogComponent,
      {
        data: {
          parentOption: this.parentOption,
          targetingOptions: this.targetingOptions,
          availableOptions
        }
      }
    );

    const customDialogCloseSubscription = addCustomOptionDialog.afterClosed()
      .subscribe((customOption) => {
        if (customOption) {
          this.addedItems.push(customOption);
          this.itemsChange.emit(this.addedItems);
          this.setInitialState();
        }
      });
    this.subscriptions.push(customDialogCloseSubscription);
  }
}
