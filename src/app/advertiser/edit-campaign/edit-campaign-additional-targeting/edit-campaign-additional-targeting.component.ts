import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { targetingOptionModel, targetingOptionValue } from '../../../models/targeting-option.model';
import { cloneDeep } from '../../../common/utilis/helpers';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss']
})
export class EditCampaignAdditionalTargetingComponent {
  goesToSummary: boolean;
  TargetingOptionsToAdd: targetingOptionModel[];
  TargetingOptionsToExclude: targetingOptionModel[];
  addedItems: targetingOptionValue[] = [];
  excludedItems: targetingOptionValue[] = [];

  constructor(private route: ActivatedRoute) {
    this.TargetingOptionsToAdd = cloneDeep(this.route.snapshot.data.targetingOptions.criteria);
    this.TargetingOptionsToExclude = cloneDeep(this.route.snapshot.data.targetingOptions.criteria);

    this.route.queryParams.subscribe(params => this.goesToSummary = params.summary);
  }

  updateAddedItems(items) {
    this.addedItems = [];
    items.forEach((item) => this.addedItems.push(item));
  }

  updateExcludedItems(items) {
    this.excludedItems = [];
    items.forEach((item) => this.excludedItems.push(item));
  }
}
