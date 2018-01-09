import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TargetingOptionModel, TargetingOptionValue } from '../../../models/targeting-option.model';
import { cloneDeep } from '../../../common/utilis/helpers';
import { CanComponentDeactivate } from '../../advertiser-guard.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss']
})
export class EditCampaignAdditionalTargetingComponent implements CanComponentDeactivate {
  goesToSummary: boolean;
  TargetingOptionsToAdd: TargetingOptionModel[];
  TargetingOptionsToExclude: TargetingOptionModel[];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];
  changesSaved = false;

  requirePanelOpenState: boolean;
  excludePanelOpenState: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
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

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.changesSaved) {
      return confirm('Do you want to discard changes');
    }
    return true;
  }
}
