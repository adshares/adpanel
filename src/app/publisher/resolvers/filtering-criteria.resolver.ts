import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PublisherService } from 'publisher/publisher.service';
import { TargetingOption } from 'models/targeting-option.model';
import { prepareFilteringChoices } from 'common/components/targeting/targeting.helpers';

@Injectable()
export class FilteringCriteriaResolver implements Resolve<TargetingOption[]> {
  constructor(private publisherService: PublisherService) {}

  resolve(): Observable<TargetingOption[]> {
    return this.publisherService
      .getFilteringCriteria()
      .pipe(map(filteringOptions => prepareFilteringChoices(filteringOptions)));
  }
}
