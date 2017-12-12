import { Component, OnInit, DoCheck, Input, IterableDiffers } from '@angular/core';
import { targetingOptionModel, targetingOptionValue } from '../../../models/targeting-option.model';

@Component({
  selector: 'app-targeting-select',
  templateUrl: './targeting-select.component.html',
  styleUrls: ['./targeting-select.component.scss']
})
export class TargetingSelectComponent implements OnInit, DoCheck {
  @Input() targetingOptions;
  @Input() addedItems;
  arrayDiffer: any;
  backAvailable: boolean = false;
  optionsHasValue: boolean = false;
  searchTerm: string = '';
  targetingOptionsForSearch: targetingOptionModel[] = [];
  viewModel: targetingOptionModel[];
  parentViewModel: targetingOptionModel[];
  parentOption: targetingOptionModel;
  selectedItems: targetingOptionValue[] = [];

  constructor(private differ: IterableDiffers) {
    this.arrayDiffer = this.differ.find([]).create(null);
  }

  ngOnInit() {
    this.viewModel = this.targetingOptions;
    this.prepareTargetingOptionsForSearch();
  }

  ngDoCheck() {
    const addedItemsChanged = this.arrayDiffer.diff(this.addedItems);

    if (addedItemsChanged) {
      this.selectedItems = this.selectedItems.filter((item) => item.selected);
    }
  }

  changetViewModel(options) {
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

      this.changetViewModel(newOptions);
    } else if (option.value) {
      this.toggleItem(option);
    }
  }

  toggleItem(option) {
    option.selected = !option.selected;

    if (option.selected) {
      this.selectedItems.push(option);
    } else {
      const itemIndex = this.selectedItems.indexOf(option);

      this.selectedItems.splice(itemIndex, 1);
    }
  }

  handleItemsChange() {
    // replace values of addedItems with selectedItem without loosing reference
    [].splice.apply(this.addedItems, [0, this.addedItems.length].concat(this.selectedItems));
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

    if (searchTerm !== '') {
      this.prepareSearchViewModel();
    } else {
      this.changetViewModel(this.targetingOptions);
    }
  }

  prepareSearchViewModel() {
    const pattern = new RegExp(this.searchTerm);
    const searchModel = this.optionsHasValue ? this.viewModel : this.targetingOptionsForSearch;
    const searchViewModel = searchModel.filter((option) =>
      pattern.test(option.label.toLowerCase())
    );

    if (searchViewModel.length > 0) {
      this.changetViewModel(searchViewModel);
    } else {
      this.viewModel = [];
    }
  }
}
