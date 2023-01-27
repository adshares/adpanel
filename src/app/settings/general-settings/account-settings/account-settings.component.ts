import { Component } from '@angular/core';
import { SessionService } from '../../../session.service';
import { User } from 'models/user.model';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent {
  user: User;

  constructor(private session: SessionService) {
    this.user = this.session.getUser();
  }
}
