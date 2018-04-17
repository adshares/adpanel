import { Component } from '@angular/core';
import { appSettings } from 'app-settings';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent {
  supportEmail = appSettings.SUPPORT_EMAIL;
}
