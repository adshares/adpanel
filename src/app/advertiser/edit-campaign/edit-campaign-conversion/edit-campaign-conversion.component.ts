import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, toPayload } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { AppState } from 'models/app-state.model';
import { Campaign, CampaignConversion, CampaignConversionItem } from 'models/campaign.model';
import { campaignConversionItemInitialState } from 'models/initial-state/campaign';
import {
  ClearLastEditedCampaign,
  SaveConversion,
  UPDATE_CAMPAIGN_FAILURE,
  UPDATE_CAMPAIGN_SUCCESS
} from 'store/advertiser/advertiser.actions';

import { AdvertiserService } from 'advertiser/advertiser.service';
import { HandleSubscription } from 'common/handle-subscription';
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';
import { InformationDialogComponent } from "common/dialog/information-dialog/information-dialog.component";

@Component({
  selector: 'app-edit-campaign-conversion',
  templateUrl: './edit-campaign-conversion.component.html',
  styleUrls: ['./edit-campaign-conversion.component.scss']
})
export class EditCampaignConversionComponent extends HandleSubscription implements OnInit {
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
  action$: Actions;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private advertiserService: AdvertiserService,
    private dialog: MatDialog,
    action$: Actions,
  ) {
    super();
    this.action$ = action$;
  }

  ngOnInit() {
    this.getFormDataFromStore();
  }

  get conversionItemFormsAdvanced(): FormGroup[] {
    return this.conversionItemForms.filter(form => form.get('isAdvanced').value);
  }

  get conversionItemFormsBasic(): FormGroup[] {
    return this.conversionItemForms.filter(form => !form.get('isAdvanced').value);
  }

  updateCampaignConversion(): void {
    this.submitted = true;
    this.validateForm = true;

    if (!this.isFormValid) {
      this.submitted = false;
      return;
    }

    this.validateForm = false;
    this.campaign = {
      ...this.campaign,
      conversions: this.conversionsToSave,
    };
    this.store.dispatch(new SaveConversion(this.campaign));

    this.action$
      .ofType(
        UPDATE_CAMPAIGN_SUCCESS,
      )
      .first()
      .subscribe(() => {
        this.submitted = false;
        this.conversionItemForms.forEach(item => item.markAsPristine());
        this.conversionItemForms.forEach(item => item.markAsUntouched());
      });

    this.action$
      .ofType(
        UPDATE_CAMPAIGN_FAILURE
      )
      .first()
      .subscribe(() => {
        this.submitted = false;
      });

  }

  isSubmitDisabled() {
    return this.submitted ||
      (this.conversionItemForms.findIndex(item => (item.touched && item.dirty)) === -1 &&
        this.campaign.conversions.length === this.conversionItemForms.length);
  }

  get isFormValid(): boolean {
    return this.conversionItemForms.every(item => item.valid);
  }

  generateFormConversionItem(item: CampaignConversionItem): FormGroup {
    const itemUuid = item.uuid;
    const itemIsAdvanced = item.isAdvanced;
    const isItemFromBackend = itemUuid != null;

    const valueValidators = [Validators.min(0)];
    if (!itemIsAdvanced) {
      valueValidators.push(Validators.required);
    }

    return new FormGroup({
      uuid: new FormControl(itemUuid),
      name: new FormControl({value: item.name, disabled: isItemFromBackend}, Validators.required),
      type: new FormControl({value: item.eventType, disabled: isItemFromBackend}, Validators.required),
      isAdvanced: new FormControl({value: itemIsAdvanced, disabled: isItemFromBackend}),
      isInBudget: new FormControl({value: item.isInBudget, disabled: isItemFromBackend || !itemIsAdvanced}),
      value: new FormControl({value: item.value, disabled: isItemFromBackend}, valueValidators),
      limit: new FormControl({value: item.limit, disabled: isItemFromBackend}, Validators.min(0)),
      link: new FormControl(item.link),
      secret: new FormControl(item.secret),
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
      .first()
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
            secret: conversion.secret,
            link: conversion.link,
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

  openDialog(form: FormGroup) {
    this.dialog.open(InformationDialogComponent, {
      data: {
        title: 'Conversion link',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ' +
          'et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ' +
          'aliquip ex ea commodo consequat.',
        link: form.get('link').value,
        href: 'https://github.com/adshares/adserver/wiki',
        secret: form.get('secret').value,
      }
    });
  }


  onStepBack(): void {
    this.store.dispatch(new ClearLastEditedCampaign());
    this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
  }
}
