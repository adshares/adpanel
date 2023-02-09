import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { adStatusesEnum } from 'models/enum/ad.enum';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { STATUS_SAVE_SUCCESS } from 'common/utilities/messages';
import { AppState } from 'models/app-state.model';
import { Ad, Campaign } from 'models/campaign.model';
import { ShowSuccessSnackbar } from 'store/common/common.actions';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-poster-list-item',
  templateUrl: './ad-list-item.component.html',
  styleUrls: ['./ad-list-item.component.scss'],
})
export class AdListItemComponent {
  @Input() ad: Ad;
  @Input() campaign: Campaign;
  adStatusesEnum = adStatusesEnum;
  faChevronRight = faChevronRight;

  constructor(
    private advertiserService: AdvertiserService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private router: Router
  ) {}

  changeAdStatus(active: boolean): void {
    const previousStatus = this.ad.status;
    this.ad.status = active ? this.adStatusesEnum.ACTIVE : this.adStatusesEnum.INACTIVE;

    this.advertiserService.updateAdStatus(this.campaign.id, this.ad.id, this.ad.status).subscribe(
      () => {
        this.store.dispatch(new ShowSuccessSnackbar(STATUS_SAVE_SUCCESS));
      },
      (err: HttpErrorResponse) => {
        this.ad.status = previousStatus;
        if (err.status !== HTTP_INTERNAL_SERVER_ERROR) {
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              title: `Error during status change`,
              message: `Change is not available at this moment. Please, try again later.`,
            },
          });
        }
      }
    );
  }

  navigateToAdEdition(): void {
    this.router.navigate(['/advertiser', 'edit-campaign', this.campaign.id, 'create-ad']);
  }
}
