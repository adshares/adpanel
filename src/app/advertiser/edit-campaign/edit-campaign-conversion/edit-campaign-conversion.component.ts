import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { AppState } from 'models/app-state.model';
import { Campaign, CampaignConversion, CampaignConversionItem } from 'models/campaign.model';
import { campaignConversionItemInitialState } from 'models/initial-state/campaign';
import { UPDATE_CAMPAIGN_FAILURE, UpdateCampaign } from 'store/advertiser/advertiser.actions';

import { AdvertiserService } from 'advertiser/advertiser.service';
import { HandleSubscription } from 'common/handle-subscription';
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';

@Component({
  selector: 'app-edit-campaign-conversion',
  templateUrl: './edit-campaign-conversion.component.html',
  styleUrls: ['./edit-campaign-conversion.component.scss']
})
export class EditCampaignConversionComponent extends HandleSubscription implements OnInit, OnDestroy {
  destroyed$ = new Subject<boolean>();

  readonly MODE_BASIC: string = 'basic';
  readonly MODE_ADVANCED: string = 'advanced';

  private readonly CONVERSION_COUNT_MAXIMAL: number = 5;

  conversionItemForms: FormGroup[] = [];
  campaign: Campaign;

  campaignConversions: CampaignConversionItem[] = [];
  isConversionActive: boolean = false;
  isClickConversion: boolean = false;

  validateForm: boolean = false;
  submitted: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private advertiserService: AdvertiserService,
    private dialog: MatDialog,
    updates$: Actions,
  ) {
    super();

    updates$
      .ofType(UPDATE_CAMPAIGN_FAILURE)
      .takeUntil(this.destroyed$)
      .do(() => {
        this.submitted = false;
      })
      .subscribe();
  }

  ngOnInit() {
    // TODO check if really needed - it affects with adding additional empty row - subscription from getFormDataFromStore is executed
    const subscription = this.advertiserService.cleanEditedCampaignOnRouteChange(true);
    subscription && this.subscriptions.push(subscription);

    this.getFormDataFromStore();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();

    super.ngOnDestroy();
  }

  updateCampaignConversion() {
    this.validateForm = true;

    if (!this.isFormValid) {
      return;
    }

    this.validateForm = false;
    this.submitted = true;

    this.campaign = {
      ...this.campaign,
      conversions: this.conversionItemsToSave,
    };

    this.store.dispatch(new UpdateCampaign(this.campaign));
  }

  get isFormValid() {
    return this.conversionItemForms.every(item => item.valid);
  }

  generateFormConversionItem(item: CampaignConversionItem): FormGroup {
    return new FormGroup({
      id: new FormControl(item.id),
      name: new FormControl(item.name, Validators.required),
      type: new FormControl(item.eventType),
      isAdvanced: new FormControl(item.isAdvanced),
      isInBudget: new FormControl({value: item.isInBudget, disabled: !item.isAdvanced}),
      value: new FormControl(item.value, Validators.min(0)),
      limit: new FormControl(item.limit, Validators.min(0)),
    });
  }

  get conversionItemsToSave(): CampaignConversion[] {
    return this.conversionItemForms.map((form) => {
      return {
        id: form.get('id').value,
        name: form.get('name').value,
        budgetType: form.get('isInBudget').value ? 'in_budget' : 'out_of_budget',
        eventType: form.get('type').value,
        type: form.get('isAdvanced').value ? 'advanced' : 'basic',
        value: form.get('value').value,
        limit: form.get('limit').value,
      };
    });
  }

  getFormDataFromStore() {
    let subscription = this.store.select('state', 'advertiser', 'lastEditedCampaign',)
      .subscribe((lastEditedCampaign: Campaign) => {
        this.campaign = lastEditedCampaign;

        // TODO fill this.campaignConversions with data from campaign object
        this.isClickConversion = false;
        this.campaignConversions = [];

        this.isConversionActive = this.campaignConversions.length > 0;
        this.campaignConversions.forEach(item => this.addConversion(item));
      }, () => {
      });
    this.subscriptions.push(subscription);
  }

  addConversionEmpty(mode: string): void {
    const item = <CampaignConversionItem>{
      ...campaignConversionItemInitialState,
      isAdvanced: this.MODE_ADVANCED === mode,
    };

    this.addConversion(item);
  }

  addConversion(item: CampaignConversionItem): void {
    if (this.conversionItemForms.length >= this.CONVERSION_COUNT_MAXIMAL) {
      this.dialog.open(ConfirmResponseDialogComponent, {
        data: {
          title: 'Maximum conversion count reached',
          message: `You are not able to add more than ${this.CONVERSION_COUNT_MAXIMAL} conversions.`,
        }
      });

      return;
    }

    this.conversionItemForms.push(this.generateFormConversionItem(item));
  }

  deleteConversion(index: number): void {
    this.conversionItemForms.splice(index, 1);
  }

  onStepBack(): void {
    this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
  }
}
