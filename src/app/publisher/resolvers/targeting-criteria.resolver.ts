import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PublisherService } from 'publisher/publisher.service';
import { TargetingOption } from 'models/targeting-option.model';
import { prepareTargetingChoices } from 'common/components/targeting/targeting.helpers';

@Injectable()
export class TargetingCriteriaResolver implements Resolve<any> {
  constructor(private publisherService: PublisherService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<TargetingOption[]> {
    return this.publisherService.getTargetingCriteria(route.params.id)
      .map((targetingOptions) => prepareTargetingChoices(targetingOptions));
  }
}
