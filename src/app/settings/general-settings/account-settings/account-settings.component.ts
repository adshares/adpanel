import { Component } from '@angular/core';
import { SessionService } from '../../../session.service';
import { User } from 'models/user.model';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent {
  isModerator: boolean = false;
  user: User;

  constructor(private session: SessionService) {
    this.isModerator = session.isModerator();
    this.user = this.session.getUser();
  }
}
