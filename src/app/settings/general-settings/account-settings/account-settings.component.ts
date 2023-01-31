import { Component } from '@angular/core';
import { SessionService } from '../../../session.service';
import { User } from 'models/user.model';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { ShowSuccessSnackbar } from 'store/common/common.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent {
  user: User;
  faCopy = faCopy;

  constructor(private session: SessionService, private store: Store<AppState>) {
    this.user = this.session.getUser();
  }

  copyUserId(): void {
    navigator.clipboard
      .writeText(this.user.uuid)
      .then(() => {
        this.store.dispatch(new ShowSuccessSnackbar('Copied!'));
      })
      .catch(error => console.log(error));
  }
}
