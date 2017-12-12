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
  TargetingOptionsToAdd: targetingOptionModel[];
  TargetingOptionsToExclude: targetingOptionModel[];
  addedItems: targetingOptionValue[] = [];
  excludedItems: targetingOptionValue[] = [];

  constructor(private route: ActivatedRoute) {
    this.TargetingOptionsToAdd = cloneDeep(this.route.snapshot.data.targetingOptions.criteria);
    this.TargetingOptionsToExclude = cloneDeep(this.route.snapshot.data.targetingOptions.criteria);
  }
}
