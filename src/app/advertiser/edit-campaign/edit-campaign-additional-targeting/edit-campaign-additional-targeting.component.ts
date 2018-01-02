import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TargetingOptionModel, TargetingOptionValue } from '../../../models/targeting-option.model';
import { cloneDeep } from '../../../common/utilis/helpers';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss']
})
export class EditCampaignAdditionalTargetingComponent {
  goesToSummary: boolean;
  TargetingOptionsToAdd: TargetingOptionModel[];
  TargetingOptionsToExclude: TargetingOptionModel[];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];

  requirePanelOpenState: boolean;
  excludePanelOpenState: boolean;

  constructor(private route: ActivatedRoute) {
    this.TargetingOptionsToAdd = cloneDeep(this.route.snapshot.data.targetingOptions.criteria);
    this.TargetingOptionsToExclude = cloneDeep(this.route.snapshot.data.targetingOptions.criteria);

    this.route.queryParams.subscribe(params => this.goesToSummary = params.summary);
  }

  updateAddedItems(items) {
    this.addedItems = [...items];
  }

  updateExcludedItems(items) {
    this.excludedItems = [...items];
  }
}
