import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material";
import { AdvertiserService } from 'advertiser/advertiser.service';
import { adStatusesEnum, adTypesEnum } from 'models/enum/ad.enum';
import { ErrorResponseDialogComponent } from "common/dialog/error-response-dialog/error-response-dialog.component";
import { HTTP_INTERNAL_SERVER_ERROR } from "common/utilities/codes";
import { Store } from "@ngrx/store";
import { Ad, Campaign } from 'models/campaign.model';
import { AppState } from "models/app-state.model";
import { environment } from "environments/environment";

@Component({
  selector: 'app-poster-list-item',
  templateUrl: './ad-list-item.component.html',
  styleUrls: ['./ad-list-item.component.scss'],
})
export class AdListItemComponent {
  @Input() ad: Ad;
  @Input() campaign: Campaign;
  currencySymbol = environment.currencySymbol;
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

    this.advertiserService.updateAdStatus(this.campaign.id, this.ad.id, this.ad.status).subscribe(
      () => {
      },
      (err: HttpErrorResponse) => {
        this.ad.status = status;
        if (err.status !== HTTP_INTERNAL_SERVER_ERROR) {
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
    this.router.navigate(
      ['/advertiser', 'edit-campaign', this.campaign.id, 'create-ad'],
      {queryParams: {step: 3}}
    );
  }

}
