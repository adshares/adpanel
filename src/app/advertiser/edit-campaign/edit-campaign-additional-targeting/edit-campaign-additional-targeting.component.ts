import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AdvertiserAction from '../../../store/advertiser/advertiser.action';
import { AppState } from '../../../models/app-state.model';
import { targetingOptionModel, targetingOptionValue } from '../../../models/targeting-option.model';
import { cloneDeep } from '../../../common/utilis/helpers';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss']
})
export class EditCampaignAdditionalTargetingComponent {
  goesToSummary: boolean;
  targetingOptionsToAdd: targetingOptionModel[];
  targetingOptionsToExclude: targetingOptionModel[];
  addedItems: targetingOptionValue[] = [];
  excludedItems: targetingOptionValue[] = [];

  requirePanelOpenState: boolean;
  excludePanelOpenState: boolean;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {
    this.targetingOptionsToAdd = cloneDeep(this.route.snapshot.data.targetingOptions.criteria);
    this.targetingOptionsToExclude = cloneDeep(this.route.snapshot.data.targetingOptions.criteria);

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

  saveCampaignTargeting() {
    const choosedTargeting = {
      requires: this.addedItems,
      excludes: this.excludedItems
    };
    this.store.dispatch(new AdvertiserAction.SaveCampaignTargeting(choosedTargeting));
  }
}
