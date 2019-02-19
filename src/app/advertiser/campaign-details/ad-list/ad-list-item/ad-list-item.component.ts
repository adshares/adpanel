import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog} from "@angular/material";

import {AdvertiserService} from 'advertiser/advertiser.service';
import {adStatusesEnum, adTypesEnum} from 'models/enum/ad.enum';
import {Ad, Campaign} from 'models/campaign.model';
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";
import * as codes from "common/utilities/codes";
import * as advertiserActions from "store/advertiser/advertiser.actions";
import {Store} from "@ngrx/store";
import {AppState} from "models/app-state.model";

@Component({
  selector: 'app-ad-list-item',
  templateUrl: './ad-list-item.component.html',
  styleUrls: ['./ad-list-item.component.scss'],
})
export class AdListItemComponent {
  @Input() ad: Ad;
  @Input() campaign: Campaign;

  adStatusesEnum = adStatusesEnum;

  constructor(private route: ActivatedRoute,
              private advertiserService: AdvertiserService,
              private dialog: MatDialog,
              private router: Router,
              private store: Store<AppState>) {
  }

  get adType() {
    return adTypesEnum[this.ad.type];
  };

  changeAdStatus(status) {
    const statusActive = status !== this.adStatusesEnum.ACTIVE;

    this.ad.status =
      statusActive ? this.adStatusesEnum.ACTIVE : this.adStatusesEnum.INACTIVE;

    const campaignId = this.route.snapshot.data.campaign.campaign.id;

    this.advertiserService.updateAdStatus(campaignId, this.ad.id, this.ad.status).subscribe(
      () => {},
      (err: HttpErrorResponse) => {
        this.ad.status = status;
        if (err.status !== codes.HTTP_INTERNAL_SERVER_ERROR) {
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              title: `Error during status change`,
              message: `Change is not available at this moment. Please, try again later.`,
            }
          });
        }
      }
    );
  }

  navigateToAdEdition(): void {
    this.store.dispatch(new advertiserActions.SetLastEditedCampaign(this.campaign));
    this.router.navigate(
      ['/advertiser', 'edit-campaign', 'create-ad'],
      {queryParams: {step: 3}}
    );
  }

}
