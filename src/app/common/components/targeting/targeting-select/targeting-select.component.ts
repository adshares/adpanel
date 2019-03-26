import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { AddCustomTargetingDialogComponent } from 'common/dialog/add-custom-targeting-dialog/add-custom-targeting-dialog.component';
import { HandleSubscription } from 'common/handle-subscription';
import { findOption, findOptionList, getParentId } from 'common/components/targeting/targeting.helpers';
import { cloneDeep } from 'common/utilities/helpers';

@Component({
  selector: 'app-targeting-select',
  templateUrl: './targeting-select.component.html',
  styleUrls: ['./targeting-select.component.scss']
})
export class TargetingSelectComponent extends HandleSubscription implements OnInit, OnChanges {
  @Input() targetingOptions;
  @Input() addedItems: TargetingOptionValue[];
  @Output()
  itemsChange: EventEmitter<TargetingOptionValue[]> = new EventEmitter<TargetingOptionValue[]>();
  selectedItems: TargetingOptionValue[] = [];
  viewModel: (TargetingOption | TargetingOptionValue)[];
  parentViewModel: (TargetingOption | TargetingOptionValue)[];
  parentOption: TargetingOption | TargetingOptionValue;
  targetingOptionsForSearch: TargetingOption[] = [];
  itemsToRemove: TargetingOptionValue[] = [];

  backAvailable = false;
  optionsHasValue = false;
  searchTerm = '';

  constructor(private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.selectedItems = this.addedItems;
    this.prepareTargetingOptionsForSearch();
    this.viewModel = this.targetingOptions;
    this.selectSavedItemOnList();
  }

  ngOnChanges() {
    this.deselectRemovedOptions();
    if (this.selectedItems.length === this.addedItems.length) return;
    this.selectedItems = this.addedItems;
    this.selectSavedItemOnList();
  }

  changeViewModel(options: (TargetingOption | TargetingOptionValue)[]) {
    const firstOption = options[0];
    this.viewModel = options;

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
    this.searchTerm = '';
    const optionSublist = option['children'] || option['values'];

    if (optionSublist) {
      this.changeViewModel(optionSublist);
    }
  }

  toggleItem(option: TargetingOptionValue) {
    const optionIndex = this.selectedItems.findIndex((item) => item.id === option.id);

    option.selected = !option.selected;

    if (option.selected) {
      this.handleAddItem(option, optionIndex);
    } else {
      this.handleRemoveItem(option, optionIndex);
    }
  }

  handleAddItem(
    option: TargetingOptionValue,
    itemToAddIndex: number,
  ) {
    if (itemToAddIndex === -1) {
      this.selectedItems.push(cloneDeep(option));
      this.itemsChange.emit(this.selectedItems);
    }

    if (option.parent.valueType === 'boolean') {
      this.deselectOppositeBoolean(option);
    }
  }

  handleRemoveItem(
    option: TargetingOptionValue,
    itemToRemoveIndex: number
  ) {
    this.selectedItems.splice(itemToRemoveIndex, 1);
    this.itemsChange.emit(this.selectedItems);
  }

  deselectOppositeBoolean(option: TargetingOptionValue) {
    const optionList = findOptionList(option.id, this.targetingOptions);
    const oppositeOption = optionList.find((oppositeOption) => oppositeOption.id !== option.id);
    if (oppositeOption && oppositeOption['selected']) {
      this.selectedItems = [...this.selectedItems.filter((option) => option.id !== oppositeOption.id)];
      Object.assign(oppositeOption, {selected: false});
    }
    this.itemsChange.emit(this.selectedItems);
  }

  deselectRemovedOptions(options: (TargetingOption | TargetingOptionValue)[] = this.targetingOptions) {
    options.forEach((option) => {
      const sublist = option['children'] || option['values'];
      if (sublist) {
        this.deselectRemovedOptions(sublist);
        return;
      }
      const itemInOptionsIndex = this.selectedItems.findIndex((addedItem) => addedItem.id === option.id);
      this.selectedItems = this.addedItems;
      if (itemInOptionsIndex < 0) {
        Object.assign(option, {selected: false});
      }
    });
  }

  setInitialState() {
    this.changeViewModel(this.targetingOptions);
    this.itemsToRemove = [];
    this.parentOption = null;
    this.backAvailable = false;
  }

  setBackViewModel(option: TargetingOption | TargetingOptionValue) {
    const parentOptionId = getParentId(option.id);

    this.parentViewModel = findOptionList(parentOptionId, this.targetingOptions);
    this.parentOption = this.parentViewModel.find((option) => option.id === parentOptionId);
  }

  prepareTargetingOptionsForSearch(options?: TargetingOption[]) {
    const allOptions = options
      || this.targetingOptions.reduce((prev, next) => prev.concat(next.values ? next.values : []), [])
    ;

    allOptions
      .forEach((option) => {
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
    const searchModel = this.targetingOptionsForSearch;
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
    this.selectedItems.forEach((savedItem) => {
      if (savedItem.isCustom) {
        return;
      }

      const item = findOption(savedItem.id, this.targetingOptions);

      if (item) {
        Object.assign(item, {selected: true});
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
          this.selectedItems.push(customOption);
          this.itemsChange.emit(this.selectedItems);
          this.setInitialState();
        }
      });
    this.subscriptions.push(customDialogCloseSubscription);
  }
}
