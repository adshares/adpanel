import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from 'models/app-state.model';
import { SettingsService } from 'settings/settings.service';
import { HandleSubscription } from 'common/handle-subscription';
import { User } from 'models/user.model';
import { MatDialog } from '@angular/material';
import { HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';

@Component({
  selector: 'app-newsletter-settings',
  templateUrl: './newsletter-settings.component.html',
  styleUrls: ['./newsletter-settings.component.scss']
})
export class NewsletterSettingsComponent extends HandleSubscription implements OnInit {
  isSubscribed: boolean = false;
  isSettingDisabled: boolean = true;

  constructor(
    private store: Store<AppState>,
    private settingsService: SettingsService,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    this.store.select('state', 'user', 'data')
      .take(1)
      .subscribe((user: User) => {
        this.isSubscribed = user.isSubscribed;
        this.isSettingDisabled = false;
      });
  }

  onChangeSubscription(isSubscribed: boolean): void {
    this.isSettingDisabled = true;

    this.settingsService.newsletter(isSubscribed).subscribe(
      () => {
        this.isSettingDisabled = false;
      },
      (error) => {
        if (error.status !== HTTP_INTERNAL_SERVER_ERROR) {
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              message: `Please, try again later.`,
            }
          });
        }

        this.isSubscribed = !isSubscribed;
        this.isSettingDisabled = false;
      });
  }
}
