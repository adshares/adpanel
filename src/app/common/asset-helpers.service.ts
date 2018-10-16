import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Campaign } from 'models/campaign.model'
import { Site } from 'models/site.model'

@Injectable()
export class AssetHelpersService {

  constructor(private router: Router) {
  }

  redirectIfNameNotFilled(asset: Campaign | Site): boolean {
    const obligatoryField = this.isSite(asset) ?
      asset['name'] : (
        (asset['site'] && this.isSite(asset['site'])) ? asset['site']['name'] : asset['basicInformation']['name']
      );
    const fieldFilled = obligatoryField !== '';

    if (!fieldFilled) {
      const moduleDir = this.isSite(asset) ? 'publisher' : 'advertiser';
      const assetDir = this.isSite(asset) ? 'create-site' : 'create-campaign';

      this.router.navigate(
        [moduleDir, assetDir, 'basic-information'],
        {queryParams: {step: 1}}
      );
    }

    return fieldFilled
  }

  isSite(object: any): boolean {
    return 'name' in object;
  }
}
