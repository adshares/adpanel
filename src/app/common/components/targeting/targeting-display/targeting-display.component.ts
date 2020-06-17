import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { TargetingOptionValue } from 'models/targeting-option.model';
import { getLabelCompound, getLabelPath } from 'common/components/targeting/targeting.helpers';

@Component({
  selector: 'app-targeting-display',
  templateUrl: './targeting-display.component.html',
  styleUrls: ['./targeting-display.component.scss']
})
export class TargetingDisplayComponent implements OnChanges {
  @Input() items;
  @Input() canRemove;
  @Input() isExclude;
  @Input() targetingOptions;
  @Output()
  itemsChange: EventEmitter<TargetingOptionValue[]> = new EventEmitter<TargetingOptionValue[]>();
  viewModel: {
    parentPath: string;
    chosenTargeting: {
      id: string;
      label: string;
    }[]
  }[];

  ngOnChanges() {
    this.prepareItemsToDisplay();
  }

  prepareItemsToDisplay(): void {
    this.viewModel = [];
    if (!this.items.length) return;
    this.items.forEach((item) => {
      const chosenTargetingItem = {
        id: item.id,
        label: getLabelCompound(item, this.targetingOptions),
      };

      const itemLabelPath = getLabelPath(item.id, this.targetingOptions);
      const viewModelParentPathIndex = this.viewModel.findIndex(
        (viewModelItem) => {
          return viewModelItem.parentPath === itemLabelPath;
        }
      );

      if (viewModelParentPathIndex >= 0) {
        this.viewModel[viewModelParentPathIndex].chosenTargeting.push(chosenTargetingItem);

        return;
      }

      this.viewModel.push({
        parentPath: itemLabelPath,
        chosenTargeting: [chosenTargetingItem],
      });
    });
  }

  removeItem(itemId: string): void {
    const itemInItemsIndex = this.items.findIndex((item) => item.id === itemId);

    this.items.splice(itemInItemsIndex, 1);
    this.itemsChange.emit(this.items);
    this.prepareItemsToDisplay();
  }
}
