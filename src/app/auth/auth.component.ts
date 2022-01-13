import { Component } from '@angular/core';

import { fadeAnimation } from 'common/animations/fade.animation';
import { environment } from "environments/environment";
import { appSettings } from "app-settings";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [fadeAnimation]
})

export class AuthComponent {
  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';

  advertiserInstructionLink = appSettings.ADVERTISER_INSTRUCTION_LINK;
  publisherInstructionLink = appSettings.PUBLISHER_INSTRUCTION_LINK;
  privacyPolicyLink = appSettings.PRIVACY_POLICY_LINK
  termsOfServiceLink = appSettings.TERMS_OF_SERVICE_LINK
  source: string;
  version: string;

  constructor(
  ) {
    this.source = environment.name.toLowerCase().replace(/\s+/, '-');
    this.version = environment.version;
  }
}
