import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { PublisherService } from 'publisher/publisher.service';
import { AdUnitMetaData } from 'models/site.model';

@Injectable()
export class AdUnitSizesResolver implements Resolve<AdUnitMetaData[]> {
  constructor(private publisherService: PublisherService) {
  }

  resolve(): Observable<AdUnitMetaData[]> {
    return this.publisherService.getAdUnitSizes();
  }
}
