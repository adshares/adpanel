import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { AppState } from 'models/app-state.model';
import { Campaign, CampaignConversion, CampaignConversionItem, CampaignsConfig } from 'models/campaign.model';
import { campaignConversionItemInitialState } from 'models/initial-state/campaign';
import { CONVERSIONS_DESCRIPTION } from 'models/enum/link.enum';
import {
  ClearLastEditedCampaign,
  LoadCampaignsConfig,
  SaveConversion,
  UPDATE_CAMPAIGN_FAILURE,
  UPDATE_CAMPAIGN_SUCCESS,
} from 'store/advertiser/advertiser.actions';
import { faTriangleExclamation, faCopy } from '@fortawesome/free-solid-svg-icons';

import { AdvertiserService } from 'advertiser/advertiser.service';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';
import { ConversionLinkInformationDialogComponent } from 'common/dialog/information-dialog/conversion-link-information-dialog.component';
import { ShowDialogOnError } from 'store/common/common.actions';
import { adsToClicks, clicksToAds, formatMoney } from 'common/utilities/helpers';
import { campaignConversionClick } from 'models/enum/campaign.enum';
import { CustomValidators } from 'common/utilities/forms';
import { ServerOptionsService } from 'common/server-options.service';

@Component({
  selector: 'app-edit-campaign-conversion',
  templateUrl: './edit-campaign-conversion.component.html',
  styleUrls: ['./edit-campaign-conversion.component.scss'],
})
export class EditCampaignConversionComponent extends HandleSubscriptionComponent implements OnInit {
  currencyCode: string;
  readonly TYPE_ADVANCED: string = 'advanced';
  readonly TYPE_BASIC: string = 'basic';

  private readonly CONVERSION_COUNT_MAXIMAL: number = 100;
  private readonly BUDGET_TYPE_IN: string = 'in_budget';
  private readonly BUDGET_TYPE_OUT: string = 'out_of_budget';

  faTriangleExclamation = faTriangleExclamation;
  faCopy = faCopy;
  CONVERSIONS_DESCRIPTION = CONVERSIONS_DESCRIPTION;

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

  readonly clickConversionTypes = [
    { value: campaignConversionClick.NONE, label: 'Default' },
    { value: campaignConversionClick.BASIC, label: 'Basic link' },
    { value: campaignConversionClick.ADVANCED, label: 'Advanced link' },
  ];

  conversionItemForms: FormGroup[] = [];
  campaignsConfig: CampaignsConfig;
  public campaign: Campaign;

  validateForm: boolean = false;
  submitted: boolean = false;

  action$: Actions;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private advertiserService: AdvertiserService,
    private serverOptionsService: ServerOptionsService,
    private dialog: MatDialog,
    action$: Actions
  ) {
    super();
    this.action$ = action$;
  }

  ngOnInit(): void {
    this.getFormDataFromStore();
  }

  get conversionItemFormsAdvanced(): FormGroup[] {
    return this.conversionItemForms.filter(form => form.get('isAdvanced').value);
  }

  get conversionItemFormsBasic(): FormGroup[] {
    return this.conversionItemForms.filter(form => !form.get('isAdvanced').value);
  }

  onConversionClickChange(value): void {
    this.campaign = { ...this.campaign, conversionClick: value };
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

    this.action$.pipe(ofType(UPDATE_CAMPAIGN_SUCCESS, UPDATE_CAMPAIGN_FAILURE), first()).subscribe((action: Action) => {
      this.submitted = false;
      if (action.type === UPDATE_CAMPAIGN_SUCCESS) {
        this.conversionItemForms.forEach(item => item.markAsPristine());
        this.conversionItemForms.forEach(item => item.markAsUntouched());
        this.advertiserService
          .getCampaign(this.campaign.id)
          .pipe(first())
          .subscribe(
            data => {
              this.campaign = data.campaign;
              this.adjustConversionData(this.campaign.conversions);
            },
            error => {
              this.store.dispatch(new ShowDialogOnError(error.code));
            }
          );
      }
    });
  }

  get isConversionClickAdvanced(): boolean {
    return this.campaign.conversionClick === campaignConversionClick.ADVANCED;
  }

  get isFormValid(): boolean {
    this.validateAdvancedValueControl();
    return this.conversionItemForms.every(item => item.valid);
  }

  isFormError(type: 'basic' | 'advanced'): boolean {
    this.validateAdvancedValueControl();
    if (type === 'basic') {
      return this.conversionItemForms.filter(form => !form.get('isAdvanced').value).every(item => item.valid);
    }

    if (type === 'advanced') {
      return this.conversionItemForms.filter(form => form.get('isAdvanced').value).every(item => item.valid);
    }
    return this.conversionItemForms.every(item => item.valid);
  }

  validateAdvancedValueControl() {
    const elementsWithError = this.conversionItemForms.filter(
      el => el.controls.isAdvanced.value && !!el.controls.isValueMutable.value === false && !el.controls.value.value
    );
    const validElements = this.conversionItemForms.filter(
      el =>
        el.controls.isAdvanced.value &&
        !!el.controls.isValueMutable.value === true &&
        el.controls.value.status === 'INVALID'
    );

    if (elementsWithError) {
      elementsWithError.forEach(el => {
        el.controls.value.setErrors({ required: true });
      });
    }

    if (validElements) {
      validElements.forEach(el => {
        el.controls.value.setErrors(null);
      });
    }
  }

  generateFormConversionItem(item: CampaignConversionItem): FormGroup {
    const itemUuid = item.uuid;
    const itemIsAdvanced = item.isAdvanced;

    const valueValidators = [CustomValidators.minOrZero(clicksToAds(this.campaignsConfig.minCpa))];
    if (!itemIsAdvanced) {
      valueValidators.push(Validators.required);
    }

    return new FormGroup({
      uuid: new FormControl(itemUuid),
      name: new FormControl(item.name, Validators.required),
      type: new FormControl(item.eventType, Validators.required),
      isAdvanced: new FormControl({ value: itemIsAdvanced, disabled: true }),
      isInBudget: new FormControl({
        value: item.isInBudget,
        disabled: !itemIsAdvanced,
      }),
      isValueMutable: new FormControl(item.isValueMutable || false),
      isRepeatable: new FormControl({
        value: item.isRepeatable || false,
        disabled: !itemIsAdvanced,
      }),
      value: new FormControl(item.value, valueValidators),
      link: new FormControl(item.link),
    });
  }

  get conversionsToSave(): CampaignConversion[] {
    return this.conversionItemForms.map(form => {
      const value = form.get('value').value;

      return <CampaignConversion>{
        uuid: form.get('uuid').value,
        name: form.get('name').value,
        limitType: form.get('isInBudget').value ? this.BUDGET_TYPE_IN : this.BUDGET_TYPE_OUT,
        eventType: form.get('type').value,
        type: form.get('isAdvanced').value ? this.TYPE_ADVANCED : this.TYPE_BASIC,
        value: value !== null ? adsToClicks(parseFloat(value)) : null,
        isValueMutable: form.get('isValueMutable').value,
        isRepeatable: form.get('isRepeatable').value,
      };
    });
  }

  adjustConversionData(conversions) {
    this.conversionItemForms = [];
    conversions.forEach(conversion => {
      const item = {
        uuid: conversion.uuid,
        name: conversion.name,
        eventType: conversion.eventType,
        isAdvanced: conversion.type === this.TYPE_ADVANCED,
        isInBudget: conversion.limitType !== this.BUDGET_TYPE_OUT,
        isValueMutable: conversion.isValueMutable,
        isRepeatable: conversion.isRepeatable,
        value: conversion.value !== null ? formatMoney(conversion.value, 11, true, '.', '') : null,
        link: conversion.link,
      };
      this.addConversion(item);
    });
  }

  getFormDataFromStore(): void {
    this.currencyCode = this.serverOptionsService.getOptions().displayCurrency;
    this.store.dispatch(new LoadCampaignsConfig());

    const subscription = this.store
      .select('state', 'advertiser', 'lastEditedCampaign')
      .pipe(first())
      .subscribe((lastEditedCampaign: Campaign) => {
        this.campaign = lastEditedCampaign;
      });

    const configSubscription = this.store
      .select('state', 'advertiser', 'campaignsConfig')
      .subscribe((config: CampaignsConfig) => {
        this.campaignsConfig = config;
        this.adjustConversionData(this.campaign.conversions);
      });

    this.subscriptions.push(subscription, configSubscription);
  }

  addConversionEmpty(type: string): void {
    const item = <CampaignConversionItem>{
      ...campaignConversionItemInitialState,
      isAdvanced: this.TYPE_ADVANCED === type,
    };

    this.addConversion(item);
  }

  addConversion(item: CampaignConversionItem): void {
    if (this.conversionItemForms.length >= this.CONVERSION_COUNT_MAXIMAL) {
      this.dialog.open(ConfirmResponseDialogComponent, {
        data: {
          title: 'Maximum conversion count reached',
          message: `You are not able to add more than ${this.CONVERSION_COUNT_MAXIMAL} conversions.`,
        },
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

  openDialogForForm(form: FormGroup) {
    const isAdvanced = form.get('isAdvanced').value;
    const link = form.get('link').value;
    this.openDialog(link, isAdvanced);
  }

  openDialog(link: string, isAdvanced: boolean = true) {
    this.dialog.open(ConversionLinkInformationDialogComponent, {
      data: {
        isAdvanced: isAdvanced,
        link: link,
      },
    });
  }

  onStepBack(): void {
    this.store.dispatch(new ClearLastEditedCampaign());
    this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
  }
}
