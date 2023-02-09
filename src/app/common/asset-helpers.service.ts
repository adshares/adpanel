import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Campaign } from 'models/campaign.model';
import { Site } from 'models/site.model';

@Injectable()
export class AssetHelpersService {
  constructor(private router: Router) {}

  redirectIfNameNotFilled(asset: Campaign | Site): boolean {
    const obligatoryField = () => {
      if (this.isSite(asset)) {
        return asset['name'];
      } else if (asset['site'] && this.isSite(asset['site'])) {
        return asset['site']['name'];
      } else {
        return asset['basicInformation']['name'];
      }
    };
    const fieldFilled = obligatoryField() !== '';
    if (!fieldFilled) {
      if (this.isSite(asset)) {
        this.router.navigate(['publisher', 'create-site', 'basic-information']);
      } else {
        this.router.navigate(['advertiser', 'create-campaign', 'basic-information']);
      }
    }

    return fieldFilled;
  }

  isSite(object: any): boolean {
    return 'name' in object;
  }
}
