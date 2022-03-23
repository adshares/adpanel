import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PublisherService } from 'publisher/publisher.service';
import { TargetingOption } from 'models/targeting-option.model';
import { prepareFilteringChoices } from 'common/components/targeting/targeting.helpers';

@Injectable()
export class FilteringCriteriaResolver implements Resolve<TargetingOption[]> {
  constructor(private publisherService: PublisherService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<TargetingOption[]> {
    return this.publisherService.getFilteringCriteria()
      .map((filteringOptions) => prepareFilteringChoices(filteringOptions));
  }
}
