import { Component } from '@angular/core';
import { appSettings } from 'app-settings';

@Component({
  selector: 'app-confirmation-send-recovery-password',
  templateUrl: './confirmation-send-recovery-password.component.html',
  styleUrls: ['./confirmation-send-recovery-password.component.scss'],
})
export class ConfirmationSendRecoveryPasswordComponent {
  supportEmail = appSettings.SUPPORT_EMAIL;
}
