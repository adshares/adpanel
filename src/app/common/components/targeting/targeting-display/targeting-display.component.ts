import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { getLabelCompound, getLabelPath } from 'common/components/targeting/targeting.helpers';

@Component({
  selector: 'app-targeting-display',
  templateUrl: './targeting-display.component.html',
  styleUrls: ['./targeting-display.component.scss']
})
export class TargetingDisplayComponent implements OnChanges {
  @Input() items: TargetingOptionValue[];
  @Input() canRemove: boolean;
  @Input() isExclude: boolean;
  @Input() targetingOptions: TargetingOption[];
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

  removeItem(id: string): void {
    let index
    let idToRemove = id
    while ((index = this.items.findIndex(item => item.id === idToRemove)) !== -1) {
      const item = this.items.splice(index, 1)[0]
      idToRemove = item.parentId
    }
    this.itemsChange.emit(this.items)
    this.prepareItemsToDisplay()
  }
}
