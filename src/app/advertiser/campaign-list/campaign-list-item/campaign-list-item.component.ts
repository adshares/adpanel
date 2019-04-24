import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Campaign } from 'models/campaign.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import { AdvertiserService } from "advertiser/advertiser.service";
import { enumToArray } from "common/utilities/helpers";
import { MatDialog } from "@angular/material";
import { AppState } from "models/app-state.model";
import { Store } from "@ngrx/store";
import { UpdateCampaignStatus } from 'store/advertiser/advertiser.actions';
import { environment } from "environments/environment";

@Component({
  selector: 'app-campaign-list-item',
  templateUrl: './campaign-list-item.component.html',
  styleUrls: ['./campaign-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CampaignListItemComponent implements OnChanges {
  @Input() campaign: Campaign;
  currencySymbol = environment.currencySymbol;
  campaignStatusesEnum = campaignStatusesEnum;
  campaignStatusesEnumArray = enumToArray(campaignStatusesEnum);
  currentCampaignStatus: string;

  constructor(private router: Router,
              private dialog: MatDialog,
              private advertiserService: AdvertiserService,
              private store: Store<AppState>) {
  }

  ngOnChanges() {
    this.currentCampaignStatus = campaignStatusesEnum[this.campaign.basicInformation.status].toLowerCase();
  }

  navigateToCampaignDetails(campaignId: number) {
    this.router.navigate(['/advertiser', 'campaign', campaignId]);
  }

  onCampaignStatusChange(status) {
    this.store.dispatch(new UpdateCampaignStatus(
      {id: this.campaign.id, status: this.campaignStatusesEnumArray.findIndex(el => el === status)}));
  }
}
