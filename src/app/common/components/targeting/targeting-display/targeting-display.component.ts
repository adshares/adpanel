import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { getPathAndLabel } from 'common/components/targeting/targeting.helpers';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-targeting-display',
  templateUrl: './targeting-display.component.html',
  styleUrls: ['./targeting-display.component.scss'],
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
      url: string | undefined;
    }[];
  }[];
  faClose = faClose;

  ngOnChanges() {
    this.prepareItemsToDisplay();
  }

  prepareItemsToDisplay(): void {
    this.viewModel = [];
    this.items.forEach(item => {
      const [path, label] = getPathAndLabel(item, this.targetingOptions);
      const chosenTargetingItem = {
        id: item.id,
        label: label,
        url: item.url,
      };

      const viewModelParentPathIndex = this.viewModel.findIndex(viewModelItem => viewModelItem.parentPath === path);

      if (viewModelParentPathIndex >= 0) {
        this.viewModel[viewModelParentPathIndex].chosenTargeting.push(chosenTargetingItem);
        return;
      }

      this.viewModel.push({
        parentPath: path,
        chosenTargeting: [chosenTargetingItem],
      });
    });
  }

  removeItem(id: string): void {
    let index;
    let idToRemove = id;
    while ((index = this.items.findIndex(item => item.id === idToRemove)) !== -1) {
      const item = this.items.splice(index, 1)[0];
      idToRemove = item.parentId;
    }
    this.itemsChange.emit(this.items);
    this.prepareItemsToDisplay();
  }
}
