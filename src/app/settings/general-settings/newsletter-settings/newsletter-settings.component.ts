import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { AppState } from 'models/app-state.model';
import { SettingsService } from 'settings/settings.service';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { User } from 'models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { SessionService } from '../../../session.service';

@Component({
  selector: 'app-newsletter-settings',
  templateUrl: './newsletter-settings.component.html',
})
export class NewsletterSettingsComponent extends HandleSubscriptionComponent implements OnInit {
  isSubscribed: boolean = false;
  isSettingDisabled: boolean = true;
  isImpersonated: boolean = false;

  constructor(
    private store: Store<AppState>,
    private settingsService: SettingsService,
    private session: SessionService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.store
      .select('state', 'user', 'data')
      .pipe(take(1))
      .subscribe((user: User) => {
        this.isSubscribed = user.isSubscribed;
        this.isSettingDisabled = false;
      });
    this.isImpersonated = this.session.isImpersonated();
  }

  onChangeSubscription(isSubscribed: boolean): void {
    this.isSettingDisabled = true;

    this.settingsService.newsletter(isSubscribed).subscribe(
      () => {
        this.isSettingDisabled = false;
      },
      error => {
        if (error.status !== HTTP_INTERNAL_SERVER_ERROR) {
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              message: `Please, try again later.`,
            },
          });
        }

        this.isSubscribed = !isSubscribed;
        this.isSettingDisabled = false;
      }
    );
  }
}
