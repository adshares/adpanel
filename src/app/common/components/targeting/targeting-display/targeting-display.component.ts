import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { TargetingOptionValue } from '../../../../models/targeting-option.model';

@Component({
  selector: 'app-targeting-display',
  templateUrl: './targeting-display.component.html',
  styleUrls: ['./targeting-display.component.scss']
})
export class TargetingDisplayComponent implements OnChanges {
  @Input() items;
  @Input() canRemove;
  @Input() isExclude;
  @Output()
  itemsChange: EventEmitter<TargetingOptionValue[]> = new EventEmitter<TargetingOptionValue[]>();
  viewModel: [TargetingOptionValue[]][] = [];

  ngOnChanges() {
    this.prepareItemsToDisplay();
  }

  prepareItemsToDisplay() {
    this.viewModel = [];

    this.items.forEach((item) => {
      const viewModelParentLabelIndex = this.viewModel.findIndex(
        (viewModelItem) => viewModelItem[0] === item.parent_label
      );

      if (viewModelParentLabelIndex >= 0) {
        this.viewModel[viewModelParentLabelIndex][1].push(item);
      } else {
        this.viewModel.push([item.parent_label, [item]]);
      }
    });
  }

  removeItem(item) {
    const itemInItemsIndex = this.items.findIndex((itemInItems) => itemInItems.key === item.key);

    item.selected = false;
    this.items.splice(itemInItemsIndex, 1);
    this.itemsChange.emit(this.items);
  }
}
