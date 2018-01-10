import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TargetingOptionModel, TargetingOptionValue } from '../../../models/targeting-option.model';
import { cloneDeep } from '../../../common/utilis/helpers';
import { HandleLeaveEditProcess } from '../../../common/handle-leave-edit-process';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss']
})
export class EditCampaignAdditionalTargetingComponent extends HandleLeaveEditProcess {
  goesToSummary: boolean;
  TargetingOptionsToAdd: TargetingOptionModel[];
  TargetingOptionsToExclude: TargetingOptionModel[];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];

  requirePanelOpenState: boolean;
  excludePanelOpenState: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
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

  saveCampaignAdditionalInformation(isDraft) {
    this.changesSaved = true;

    if (!isDraft) {
      const link = this.goesToSummary ? '/advertiser/create-campaign/summary' : '/advertiser/create-campaign/create-ad';
      const param = this.goesToSummary ? 4 : 3;
      this.router.navigate([link], {queryParams: { step: param } });
    }
  }
}
