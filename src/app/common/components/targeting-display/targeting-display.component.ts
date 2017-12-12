import { Component, DoCheck, Input, IterableDiffers } from '@angular/core';
import { targetingOptionValue } from '../../../models/targeting-option.model';

@Component({
  selector: 'app-targeting-display',
  templateUrl: './targeting-display.component.html',
  styleUrls: ['./targeting-display.component.scss']
})
export class TargetingDisplayComponent implements DoCheck {
  @Input() items;
  viewModel: [targetingOptionValue[]][] = [];
  arrayDiffer: any;

  constructor(private _differ: IterableDiffers) {
    this.arrayDiffer = this._differ.find([]).create(null);
  }

  ngDoCheck() {
    const itemsChanged = this.arrayDiffer.diff(this.items);

    if (itemsChanged) {
      this.prepareItemsToDisplay();
    }
  }

  prepareItemsToDisplay() {
    this.viewModel = [];

    this.items.forEach((item) => {
      const viewModelParentLabelIndex = this.viewModel.findIndex(
        (viewModelItem) => viewModelItem[0] === item.parent_label
      );

      if (viewModelParentLabelIndex >= 0 ) {
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
  }
}
