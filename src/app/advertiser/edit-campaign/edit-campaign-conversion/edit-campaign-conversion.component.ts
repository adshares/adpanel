import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

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
import { ShowDialogOnError } from "store/common/common.actions";
import { ClickToADSPipe } from "common/pipes/adshares-token.pipe";
import { adsToClicks, formatMoney } from "common/utilities/helpers";

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
    private clickToADSPipe: ClickToADSPipe
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
        UPDATE_CAMPAIGN_FAILURE
      )
      .first()
      .subscribe((action) => {
        this.submitted = false;
        if (action.type === UPDATE_CAMPAIGN_SUCCESS) {
          this.conversionItemForms.forEach(item => item.markAsPristine());
          this.conversionItemForms.forEach(item => item.markAsUntouched());
          this.advertiserService.getConversions(this.campaign.id)
            .first()
            .subscribe(
              (data) => {
                this.conversionItemForms = [];
                this.adjustConversionData(data)
              },
              (err) => {
                this.store.dispatch(new ShowDialogOnError(err.code))
              }
            )
        }
      });
  }

  get isFormValid(): boolean {
    this.validateAdvancedValueControl();
    return this.conversionItemForms.every(item => item.valid);
  }

  validateAdvancedValueControl() {
    const elementsWithError = this.conversionItemForms
      .filter(el => el.controls.isAdvanced.value && !!el.controls.isValueMutable.value === false && !el.controls.value.value);
    const validElements = this.conversionItemForms
      .filter(el => el.controls.isAdvanced.value && !!el.controls.isValueMutable.value === true && el.controls.value.status === 'INVALID');

    if (elementsWithError) {
      elementsWithError.forEach(el => {
        el.controls.value.setErrors({'required': true})
      })
    }

    if (validElements) {
      validElements.forEach(el => {
        el.controls.value.setErrors(null)
      })
    }
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
      isValueMutable: new FormControl({
        value: item.isValueMutable || 0,
        disabled: isItemFromBackend || !itemIsAdvanced
      }),
      isRepeatable: new FormControl({value: item.isRepeatable || 0, disabled: isItemFromBackend || !itemIsAdvanced}),
      value: new FormControl({value: item.value, disabled: isItemFromBackend}, valueValidators),
      limit: new FormControl({value: item.limit, disabled: isItemFromBackend}, Validators.min(0)),
      link: new FormControl(item.link),
      secret: new FormControl(item.secret),
    });
  }

  get conversionsToSave(): CampaignConversion[] {
    let items = this.conversionItemForms.map((form) => {
      const isMutable = form.get('isValueMutable').value;
      const costValue = form.get('value').value;

      return <CampaignConversion>{
        uuid: form.get('uuid').value,
        name: form.get('name').value,
        budgetType: form.get('isInBudget').value ? this.BUDGET_TYPE_IN : this.BUDGET_TYPE_OUT,
        eventType: form.get('type').value,
        type: form.get('isAdvanced').value ? this.TYPE_ADVANCED : this.TYPE_BASIC,
        value: !isMutable ? `${adsToClicks(parseFloat(costValue))}`: costValue,
        limit: form.get('limit').value !== null ? `${adsToClicks(form.get('limit').value)}` : form.get('limit').value,
        isValueMutable: isMutable,
        isRepeatable: form.get('isRepeatable').value,
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

  adjustConversionData(conversions) {
    this.isClickConversionBasic = false;
    this.isClickConversionAdvanced = false;
    conversions.forEach(conversion => {
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
        isValueMutable: conversion.isValueMutable,
        isRepeatable: conversion.isRepeatable,
        value: !conversion.isValueMutable ? `${formatMoney(conversion.value)}` : conversion.value,
        limit: conversion.limit !== null ? `${formatMoney(conversion.limit)}` : conversion.limit,
        secret: conversion.secret,
        link: conversion.link,
      };
      this.addConversion(item);
    });
  }


  getFormDataFromStore(): void {
    let subscription = this.store.select('state', 'advertiser', 'lastEditedCampaign')
      .first()
      .subscribe((lastEditedCampaign: Campaign) => {
        this.campaign = lastEditedCampaign;
        this.adjustConversionData(this.campaign.conversions);
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
    const message = form.get('isAdvanced').value ?
      'Secret is a string of characters used to sign the transferred data.' +
      'The link above is a conversion address, that must be used in order to execute a conversion. ' +
      'Please, place it on your site (e.g. as a src attribute of an img element). ' +
      'Before you proceed further, please read the instruction and modify the link according to the guidelines:'
      :
      'The link above is a conversion address, that must be used in order to execute a conversion. ' +
      'Please, place it on your site (e.g. as a src attribute of an img element). ' +
      'Before you proceed further, please read the instruction:';

    this.dialog.open(InformationDialogComponent, {
      data: {
        title: 'Conversion link',
        message: message,
        link: form.get('link').value,
        href: 'https://github.com/adshares/adserver/wiki/Conversions',
        secret: form.get('secret').value,
      }
    });
  }

  onStepBack(): void {
    this.store.dispatch(new ClearLastEditedCampaign());
    this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
  }
}
