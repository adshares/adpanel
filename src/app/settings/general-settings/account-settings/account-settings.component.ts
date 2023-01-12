import { Component } from '@angular/core';
import { SessionService } from '../../../session.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent {
  isModerator: boolean = false;

  constructor(private session: SessionService) {
    this.isModerator = session.isModerator();
  }
}
