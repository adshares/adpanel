import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, toPayload } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { AppState } from 'models/app-state.model';
import { Campaign, CampaignConversion, CampaignConversionItem } from 'models/campaign.model';
import { campaignConversionItemInitialState } from 'models/initial-state/campaign';
import { UPDATE_CAMPAIGN_FAILURE, UpdateCampaign } from 'store/advertiser/advertiser.actions';

import { AdvertiserService } from 'advertiser/advertiser.service';
import { HandleSubscription } from 'common/handle-subscription';
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';

@Component({
  selector: 'app-edit-campaign-conversion',
  templateUrl: './edit-campaign-conversion.component.html',
  styleUrls: ['./edit-campaign-conversion.component.scss']
})
export class EditCampaignConversionComponent extends HandleSubscription implements OnInit, OnDestroy {
  destroyed$ = new Subject<boolean>();

  readonly TYPE_ADVANCED: string = 'advanced';
  readonly TYPE_BASIC: string = 'basic';

  private readonly CONVERSION_COUNT_MAXIMAL: number = 5;
  private readonly CLICK_CONVERSION_NAME: string = 'click';
  private readonly CLICK_CONVERSION_EVENT_TYPE: string = 'click';
  private readonly BUDGET_TYPE_IN: string = 'in_budget';
  private readonly BUDGET_TYPE_OUT: string = 'out_of_budget';

  readonly availableEventTypes = [
    'Add payment info',
    'Add to cart',
    'Add to wishlist',
    'Complete registration',
    'Contact',
    'Customize Product',
    'Donate',
    'Find Location',
    'Initiate checkout',
    'Lead',
    'Purchase',
    'Schedule',
    'Search',
    'Start trial',
    'Submit application',
    'Subscribe',
    'View content',
  ];

  conversionItemForms: FormGroup[] = [];
  campaign: Campaign;

  isClickConversionBasic: boolean = false;
  isClickConversionAdvanced: boolean = false;

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
      .map(toPayload)
      .subscribe((payload) => {
        this.dialog.open(ErrorResponseDialogComponent, {
          data: {
            message: `An error occurred. Error code: ${payload.status || 0}`,
          }
        });

        this.submitted = false;
      });
  }

  ngOnInit() {
    this.getFormDataFromStore();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();

    super.ngOnDestroy();
  }

  get conversionItemFormsAdvanced(): FormGroup[] {
    return this.conversionItemForms.filter(form => form.get('isAdvanced').value);
  }

  get conversionItemFormsBasic(): FormGroup[] {
    return this.conversionItemForms.filter(form => !form.get('isAdvanced').value);
  }

  updateCampaignConversion(): void {
    this.validateForm = true;

    if (!this.isFormValid) {
      return;
    }

    this.validateForm = false;
    this.submitted = true;

    this.campaign = {
      ...this.campaign,
      conversions: this.conversionsToSave,
    };

    this.store.dispatch(new UpdateCampaign(this.campaign));
  }

  get isFormValid(): boolean {
    return this.conversionItemForms.every(item => item.valid);
  }

  generateFormConversionItem(item: CampaignConversionItem): FormGroup {
    const itemUuid = item.uuid;
    const itemIsAdvanced = item.isAdvanced;
    const isItemFromBackend = itemUuid != null;

    return new FormGroup({
      uuid: new FormControl(itemUuid),
      name: new FormControl({value: item.name, disabled: isItemFromBackend}, Validators.required),
      type: new FormControl({value: item.eventType, disabled: isItemFromBackend}, Validators.required),
      isAdvanced: new FormControl({value: itemIsAdvanced, disabled: isItemFromBackend}),
      isInBudget: new FormControl({value: item.isInBudget, disabled: isItemFromBackend || !itemIsAdvanced}),
      value: new FormControl({value: item.value, disabled: isItemFromBackend}, Validators.min(0)),
      limit: new FormControl({value: item.limit, disabled: isItemFromBackend}, Validators.min(0)),
    });
  }

  get conversionsToSave(): CampaignConversion[] {
    let items = this.conversionItemForms.map((form) => {
      return <CampaignConversion>{
        uuid: form.get('uuid').value,
        name: form.get('name').value,
        budgetType: form.get('isInBudget').value ? this.BUDGET_TYPE_IN : this.BUDGET_TYPE_OUT,
        eventType: form.get('type').value,
        type: form.get('isAdvanced').value ? this.TYPE_ADVANCED : this.TYPE_BASIC,
        value: form.get('value').value,
        limit: form.get('limit').value,
      };
    });

    if (this.isClickConversionBasic || this.isClickConversionAdvanced) {
      items.push(this.getConversionClick());
    }

    return items;
  }

  private getConversionClick(): CampaignConversion {
    const conversion = this.campaign.conversions.find(conversion => conversion.eventType === this.CLICK_CONVERSION_EVENT_TYPE);

    if (conversion === undefined) {
      return this.createConversionClick();
    }

    const isAdvanced = conversion.type === this.TYPE_ADVANCED;

    if (this.isClickConversionBasic && !isAdvanced || this.isClickConversionAdvanced && isAdvanced) {
      return conversion;
    }

    return this.createConversionClick();
  }

  private createConversionClick(): CampaignConversion {
    return <CampaignConversion>{
      uuid: null,
      name: this.CLICK_CONVERSION_NAME,
      budgetType: this.isClickConversionAdvanced ? this.BUDGET_TYPE_OUT : this.BUDGET_TYPE_IN,
      eventType: this.CLICK_CONVERSION_EVENT_TYPE,
      type: this.isClickConversionAdvanced ? this.TYPE_ADVANCED : this.TYPE_BASIC,
      value: null,
      limit: null,
    };
  }

  getFormDataFromStore(): void {
    let subscription = this.store.select('state', 'advertiser', 'lastEditedCampaign')
      .subscribe((lastEditedCampaign: Campaign) => {
        this.campaign = lastEditedCampaign;

        this.isClickConversionBasic = false;
        this.isClickConversionAdvanced = false;
        this.campaign.conversions.forEach(conversion => {
          if (conversion.eventType === this.CLICK_CONVERSION_EVENT_TYPE) {
            if (conversion.type === this.TYPE_ADVANCED) {
              this.isClickConversionAdvanced = true;
            } else {
              this.isClickConversionBasic = true;
            }

            return;
          }

          const item = {
            uuid: conversion.uuid,
            name: conversion.name,
            eventType: conversion.eventType,
            isAdvanced: conversion.type === this.TYPE_ADVANCED,
            isInBudget: conversion.budgetType !== this.BUDGET_TYPE_OUT,
            value: conversion.value,
            limit: conversion.limit,
          };

          this.addConversion(item);
        });
      }, () => {
      });

    this.subscriptions.push(subscription);
  }

  private get conversionCount(): number {
    let count = this.conversionItemForms.length;

    if (this.isClickConversionBasic || this.isClickConversionAdvanced) {
      count++;
    }

    return count;
  }

  addConversionEmpty(type: string): void {
    const item = <CampaignConversionItem>{
      ...campaignConversionItemInitialState,
      isAdvanced: this.TYPE_ADVANCED === type,
    };

    this.addConversion(item);
  }

  addConversion(item: CampaignConversionItem): void {
    if (this.conversionCount >= this.CONVERSION_COUNT_MAXIMAL) {
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

  deleteConversion(isAdvancedList: boolean, subListIndex: number): void {
    let index = this.getIndexOnMainList(isAdvancedList, subListIndex);

    this.conversionItemForms.splice(index, 1);
  }

  private getIndexOnMainList(isAdvancedList: boolean, listIndex: number) {
    let mainListIndex = 0;
    let listIndexTemporary = -1;

    for (; mainListIndex < this.conversionItemForms.length; mainListIndex++) {
      if (this.conversionItemForms[mainListIndex].get('isAdvanced').value === isAdvancedList) {
        listIndexTemporary++;
      }

      if (listIndex === listIndexTemporary) {
        break;
      }
    }

    return mainListIndex;
  }

  onStepBack(): void {
    this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
  }
}
