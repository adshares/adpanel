import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Campaign } from 'models/campaign.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { enumToArray } from 'common/utilities/helpers';
import { MatDialog } from '@angular/material/dialog';
import { AppState } from 'models/app-state.model';
import { Store } from '@ngrx/store';
import { UpdateCampaignStatus } from 'store/advertiser/advertiser.actions';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-campaign-list-item',
  templateUrl: './campaign-list-item.component.html',
  styleUrls: ['./campaign-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListItemComponent implements OnChanges {
  @Input() campaign: Campaign;
  campaignStatusesEnum = campaignStatusesEnum;
  campaignStatusesEnumArray = enumToArray(campaignStatusesEnum);
  currentCampaignStatus: string;
  faChevronRight = faChevronRight;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private advertiserService: AdvertiserService,
    private store: Store<AppState>
  ) {}

  ngOnChanges() {
    this.currentCampaignStatus = campaignStatusesEnum[this.campaign.basicInformation.status].toLowerCase();
  }

  onCampaignStatusChange(status) {
    this.store.dispatch(
      new UpdateCampaignStatus({
        id: this.campaign.id,
        status: this.campaignStatusesEnumArray.findIndex(el => el === status),
      })
    );
  }
}
