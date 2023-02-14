import { Component } from '@angular/core';
import { SessionService } from '../../../session.service';
import { User } from 'models/user.model';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { HelperService } from 'common/helper.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent {
  user: User;
  faCopy = faCopy;

  constructor(private session: SessionService, private helperService: HelperService) {
    this.user = this.session.getUser();
  }

  copyUserId(): void {
    this.helperService.copyToClipboard(this.user.uuid);
  }
}
