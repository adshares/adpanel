import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { prepareTargetingChoices } from 'common/components/targeting/targeting.helpers';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { TargetingOption } from "models/targeting-option.model";

@Injectable()
export class TargetingCriteriaResolver implements Resolve<TargetingOption[]> {
  constructor(private advertiserService: AdvertiserService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<TargetingOption[]> {
    return this.advertiserService.getTargetingCriteria(true)
      .map((targetingOptions) => prepareTargetingChoices(targetingOptions));
  }
}
