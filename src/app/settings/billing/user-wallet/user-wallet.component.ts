import { Component } from '@angular/core';
import { appSettings } from '../../../../app-settings/app-settings';

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.scss']
})
export class UserWalletComponent {
  faqLink = appSettings.FAQ_LINK;
}
